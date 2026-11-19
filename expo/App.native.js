import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, AppState, BackHandler, Linking, StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { WebView } from "react-native-webview";
import {
  DEFAULT_INTERVAL, ensureChannel, getPermission, isWaterResponse, normalizeInterval, syncSchedule,
} from "./reminders";
import ui from "./ui.generated";

const UI_KEY = "nefes:ui:v1";
const REMINDER_KEY = "nefes:reminders:v1";
const BASE_URL = "https://nefes.invalid/";
const CREAM = "#FAF6EF";
const CSP = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none'";

function initialHtml(saved, reminders) {
  const snapshot = JSON.stringify({ saved, reminders }).replace(/</g, "\\u003c");
  const bridge = `
    (function () {
      var snapshot = ${snapshot};
      function post(message) {
        if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(message));
      }
      window.Nefes = {
        load: function () { return snapshot.saved; },
        save: function (json) { snapshot.saved = json; post({ type: "save", json: json }); },
        reminders: function () { return JSON.stringify(snapshot.reminders); },
        setReminder: function (enabled, interval) {
          post({ type: "reminder", enabled: enabled, interval: interval });
        }
      };
      window.applyNativeReminders = function (next) {
        snapshot.reminders = next;
        if (typeof window.refreshReminders === "function") window.refreshReminders();
      };
      window.nativeBack = function () {
        if (typeof window.goBack !== "function" || !window.goBack()) post({ type: "exit" });
      };
    })();
  `;
  return ui.replace("</head>", () => `<meta http-equiv="Content-Security-Policy" content="${CSP}"><script>${bridge}</script></head>`);
}

function AppScreen() {
  const webView = useRef(null);
  const runtime = useRef({
    ready: false,
    waterPending: false,
    settingsPending: false,
    reminder: { enabled: false, interval: DEFAULT_INTERVAL },
    permitted: false,
    queue: Promise.resolve(),
  }).current;
  const [source, setSource] = useState(null);
  const [loadError, setLoadError] = useState(false);

  function reminderSnapshot() {
    return { ...runtime.reminder, enabled: runtime.reminder.enabled && runtime.permitted, permitted: runtime.permitted };
  }

  function send(script) {
    if (runtime.ready) webView.current?.injectJavaScript(script + ";true;");
  }

  function publishReminders() {
    send(`window.applyNativeReminders(${JSON.stringify(reminderSnapshot())})`);
  }

  function openWater() {
    runtime.waterPending = true;
    if (runtime.ready) {
      runtime.waterPending = false;
      send("window.openWater()");
    }
  }

  function enqueue(work) {
    runtime.queue = runtime.queue.then(work).catch(error => {
      console.warn("Nefes", error.message);
    });
  }

  async function saveReminder(enabled, interval) {
    const preference = { enabled, interval };
    await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(preference));
    runtime.reminder = preference;
  }

  async function applyReminder(enabled, interval) {
    try {
      await syncSchedule(enabled, interval);
      await saveReminder(enabled, interval);
    } catch (error) {
      try {
        await syncSchedule(false, interval);
        await saveReminder(false, interval);
      } finally {
        runtime.reminder = { enabled: false, interval };
        Alert.alert("Su hatırlatmaları", "Hatırlatıcı ayarları uygulanamadı. Tekrar deneyebilirsin.");
      }
      console.warn("Nefes", error.message);
    }
  }

  async function configureReminder(enabled, interval) {
    try {
      let permission = await getPermission(enabled);
      runtime.permitted = permission.granted;
      await applyReminder(enabled && permission.granted, interval);
      if (enabled && !permission.granted && !permission.canAskAgain) {
        runtime.settingsPending = true;
        await Linking.openSettings();
      }
    } finally {
      publishReminders();
    }
  }

  function receiveResponse(response) {
    if (isWaterResponse(response)) {
      openWater();
      Notifications.clearLastNotificationResponseAsync().catch(error => console.warn("Nefes", error.message));
    }
  }

  useEffect(() => {
    let active = true;
    enqueue(async () => {
      try {
        const values = Object.fromEntries(await AsyncStorage.multiGet([UI_KEY, REMINDER_KEY]));
        const stored = JSON.parse(values[REMINDER_KEY] || "null");
        if (stored) {
          runtime.reminder = { enabled: stored.enabled === true, interval: normalizeInterval(stored.interval) };
        }
        try {
          await ensureChannel();
          runtime.permitted = (await getPermission()).granted;
          await syncSchedule(runtime.reminder.enabled && runtime.permitted, runtime.reminder.interval);
        } catch (error) {
          runtime.permitted = false;
          console.warn("Nefes", error.message);
        }
        if (active) setSource({ html: initialHtml(values[UI_KEY] || "", reminderSnapshot()), baseUrl: BASE_URL });
      } catch (error) {
        console.warn("Nefes", error.message);
        if (active) setLoadError(true);
      }
    });

    const response = Notifications.addNotificationResponseReceivedListener(receiveResponse);
    Notifications.getLastNotificationResponseAsync().then(value => {
      if (active) receiveResponse(value);
    }).catch(error => console.warn("Nefes", error.message));

    const foreground = AppState.addEventListener("change", state => {
      if (state !== "active") return;
      enqueue(async () => {
        const permission = await getPermission();
        runtime.permitted = permission.granted;
        const { enabled, interval } = runtime.reminder;
        if (runtime.settingsPending && permission.granted) {
          await applyReminder(true, interval);
        } else {
          await syncSchedule(enabled && permission.granted, interval);
        }
        runtime.settingsPending = false;
        publishReminders();
      });
    });

    const back = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!runtime.ready) return false;
      send("window.nativeBack()");
      return true;
    });

    return () => {
      active = false;
      back.remove();
      foreground.remove();
      response.remove();
    };
  }, []);

  function onMessage(event) {
    let message;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }
    if (message?.type === "save" && typeof message.json === "string") {
      enqueue(() => AsyncStorage.setItem(UI_KEY, message.json));
    } else if (message?.type === "reminder" && typeof message.enabled === "boolean") {
      enqueue(() => configureReminder(message.enabled, normalizeInterval(message.interval)));
    } else if (message?.type === "exit") {
      BackHandler.exitApp();
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      {loadError ? <LoadError /> : source ? (
        <WebView
          ref={webView}
          source={source}
          style={styles.root}
          originWhitelist={["*"]}
          onShouldStartLoadWithRequest={({ url }) => url === BASE_URL || url === "about:blank"}
          onLoadStart={() => { runtime.ready = false; }}
          onLoadEnd={() => {
            runtime.ready = true;
            publishReminders();
            if (runtime.waterPending) openWater();
          }}
          onMessage={onMessage}
          allowFileAccess={false}
          allowFileAccessFromFileURLs={false}
          allowUniversalAccessFromFileURLs={false}
          javaScriptCanOpenWindowsAutomatically={false}
          setSupportMultipleWindows={false}
          mixedContentMode="never"
        />
      ) : <ActivityIndicator style={styles.loading} color="#38694E" accessibilityLabel="Kurtuluyorum yükleniyor" />}
    </SafeAreaView>
  );
}

function LoadError() {
  return <Text style={styles.loading}>Kurtuluyorum verileri açılamadı. Uygulamayı yeniden açmayı dene.</Text>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CREAM },
  loading: { flex: 1, margin: 24, textAlign: "center", textAlignVertical: "center", color: "#38694E" },
});

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <AppScreen />
    </SafeAreaProvider>
  );
}
