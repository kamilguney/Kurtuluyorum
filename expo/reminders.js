import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL = "nefes-water";
const PREFIX = "nefes-water-";
export const DEFAULT_INTERVAL = 120;

Notifications.setNotificationHandler({
  handleNotification: async notification => {
    const now = new Date().getHours();
    const show = notification.request.identifier.startsWith(PREFIX) && now >= 9 && now < 21;
    return { shouldShowBanner: show, shouldShowList: show, shouldPlaySound: false, shouldSetBadge: false };
  },
});

export function isWaterResponse(response) {
  return response?.notification.request.identifier.startsWith(PREFIX)
    && response.notification.request.content.data?.screen === "su";
}

export function normalizeInterval(interval) {
  if (!Number.isFinite(interval)) return DEFAULT_INTERVAL;
  return Math.max(30, Math.min(240, Math.round(interval)));
}

export async function ensureChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: "Su hatırlatmaları",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function getPermission(request = false) {
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && request && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync();
  }
  if (Platform.OS === "android" && permission.granted) {
    const channel = await Notifications.getNotificationChannelAsync(CHANNEL);
    if (channel?.importance === Notifications.AndroidImportance.NONE) {
      return { granted: false, canAskAgain: false };
    }
  }
  return permission;
}

export async function syncSchedule(enabled, interval) {
  const targets = new Map();
  if (enabled) {
    for (let minutes = 9 * 60; minutes < 21 * 60; minutes += normalizeInterval(interval)) {
      targets.set(PREFIX + minutes, minutes);
    }
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const existing = new Set();
  for (const notification of scheduled) {
    const id = notification.identifier;
    if (!id.startsWith(PREFIX)) continue;
    if (targets.has(id)) existing.add(id);
    else await Notifications.cancelScheduledNotificationAsync(id);
  }
  for (const [identifier, minutes] of targets) {
    if (existing.has(identifier)) continue;
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: "Su molası",
        body: "Bir bardak su içmek için kısa bir mola ver.",
        data: { screen: "su" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        channelId: CHANNEL,
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
      },
    });
  }

  if (!enabled) {
    const presented = await Notifications.getPresentedNotificationsAsync();
    for (const notification of presented) {
      if (notification.request.identifier.startsWith(PREFIX)) {
        await Notifications.dismissNotificationAsync(notification.request.identifier);
      }
    }
  }
}
