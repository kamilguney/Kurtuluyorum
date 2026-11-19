package tr.revita.nefes;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Insets;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import org.json.JSONObject;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public final class MainActivity extends Activity {
    private static final String HOST = "nefes.local";
    private static final String HOME_URL = "https://" + HOST + "/index.html";
    private static final int NOTIFICATION_REQUEST = 1;
    private static final String CONTENT_SECURITY_POLICY = "default-src 'self'; "
            + "script-src 'self'; style-src 'self' 'unsafe-inline'; "
            + "img-src 'self' data:; font-src 'self' data:; "
            + "connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; "
            + "form-action 'none'";

    private WebView webView;
    private boolean pageReady;
    private boolean openWater;
    private boolean awaitingSettings;
    private int pendingInterval;

    @Override
    protected void onCreate(Bundle savedState) {
        super.onCreate(savedState);
        ReminderReceiver.createChannel(this);
        if (savedState != null) {
            awaitingSettings = savedState.getBoolean("awaitingSettings");
            pendingInterval = savedState.getInt("pendingInterval");
            openWater = savedState.getBoolean("openWater");
        } else {
            openWater = ReminderReceiver.OPEN_WATER.equals(getIntent().getAction());
        }

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(getColor(R.color.cream));
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((view, insets) -> {
                Insets safe = insets.getInsets(WindowInsets.Type.systemBars()
                        | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
                return WindowInsets.CONSUMED;
            });
        }
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);

        webView = new WebView(this);
        webView.setBackgroundColor(getColor(R.color.cream));
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.addJavascriptInterface(new Bridge(), "Nefes");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return true;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri url = request.getUrl();
                String path = url.getPath();
                if (!"GET".equals(request.getMethod()) || !"https".equals(url.getScheme())
                        || !HOST.equals(url.getEncodedAuthority()) || path == null
                        || !path.matches("/[a-zA-Z0-9_./-]+") || path.contains("..")
                        || (request.isForMainFrame() && !"/index.html".equals(path))) {
                    return error(403, "Forbidden");
                }
                String mime = mimeType(path);
                if (mime == null) {
                    return error(404, "Not Found");
                }
                try {
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Content-Security-Policy", CONTENT_SECURITY_POLICY);
                    headers.put("X-Content-Type-Options", "nosniff");
                    return new WebResourceResponse(mime, mime.startsWith("text/") ? "UTF-8" : null,
                            200, "OK", headers, getAssets().open(path.substring(1)));
                } catch (IOException missingAsset) {
                    return error(404, "Not Found");
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                if (HOME_URL.equals(url)) {
                    pageReady = true;
                    refreshReminders();
                    openWaterIfReady();
                }
            }
        });

        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        setContentView(root);
        webView.loadUrl(HOME_URL);
    }

    private static String mimeType(String path) {
        return switch (path.substring(path.lastIndexOf('.') + 1)) {
            case "html" -> "text/html";
            case "css" -> "text/css";
            case "js" -> "text/javascript";
            case "svg" -> "image/svg+xml";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "webp" -> "image/webp";
            case "woff2" -> "font/woff2";
            case "ttf" -> "font/ttf";
            default -> null;
        };
    }

    private static WebResourceResponse error(int status, String reason) {
        return new WebResourceResponse("text/plain", "UTF-8", status, reason, Collections.emptyMap(),
                new ByteArrayInputStream(new byte[0]));
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (awaitingSettings) {
            awaitingSettings = false;
            if (ReminderReceiver.permitted(this)) {
                ReminderReceiver.configure(this, true, pendingInterval);
            }
        }
        ReminderReceiver.ensureScheduled(this);
        refreshReminders();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (ReminderReceiver.OPEN_WATER.equals(intent.getAction())) {
            openWater = true;
            openWaterIfReady();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle state) {
        super.onSaveInstanceState(state);
        state.putBoolean("openWater", openWater);
        state.putBoolean("awaitingSettings", awaitingSettings);
        state.putInt("pendingInterval", pendingInterval);
    }

    @Override
    public void onBackPressed() {
        if (!pageReady) {
            finish();
            return;
        }
        webView.evaluateJavascript("typeof window.goBack === 'function' && window.goBack()", value -> {
            if (!"true".equals(value)) {
                finish();
            }
        });
    }

    @Override
    protected void onDestroy() {
        pageReady = false;
        ((FrameLayout) webView.getParent()).removeView(webView);
        webView.destroy();
        super.onDestroy();
    }

    private void refreshReminders() {
        if (pageReady) {
            webView.evaluateJavascript("typeof window.refreshReminders === 'function' && window.refreshReminders()", null);
        }
    }

    private void openWaterIfReady() {
        if (pageReady && openWater) {
            openWater = false;
            webView.evaluateJavascript("typeof window.openWater === 'function' && window.openWater()", null);
        }
    }

    private void configureReminder(boolean enabled, int interval) {
        if (!enabled || ReminderReceiver.permitted(this)) {
            ReminderReceiver.configure(this, enabled, interval);
            refreshReminders();
            return;
        }

        ReminderReceiver.configure(this, false, interval);
        pendingInterval = interval;
        if (Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                   != android.content.pm.PackageManager.PERMISSION_GRANTED
                && (!ReminderReceiver.settings(this).getBoolean("askedPermission", false)
                    || shouldShowRequestPermissionRationale(Manifest.permission.POST_NOTIFICATIONS))) {
            ReminderReceiver.settings(this).edit().putBoolean("askedPermission", true).apply();
            requestPermissions(new String[] { Manifest.permission.POST_NOTIFICATIONS }, NOTIFICATION_REQUEST);
        } else {
            awaitingSettings = true;
            startActivity(new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
                    .putExtra(Settings.EXTRA_APP_PACKAGE, getPackageName()));
        }
        refreshReminders();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
        super.onRequestPermissionsResult(requestCode, permissions, results);
        if (requestCode == NOTIFICATION_REQUEST) {
            ReminderReceiver.configure(this, ReminderReceiver.permitted(this), pendingInterval);
            refreshReminders();
        }
    }

    private final class Bridge {
        @JavascriptInterface
        public String load() {
            return ReminderReceiver.settings(MainActivity.this).getString("ui", "");
        }

        @JavascriptInterface
        public void save(String json) {
            if (json != null) {
                ReminderReceiver.settings(MainActivity.this).edit().putString("ui", json).apply();
            }
        }

        @JavascriptInterface
        public String reminders() {
            boolean permitted = ReminderReceiver.permitted(MainActivity.this);
            Map<String, Object> state = new HashMap<>();
            state.put("enabled", permitted && ReminderReceiver.enabled(MainActivity.this));
            state.put("interval", ReminderReceiver.interval(MainActivity.this));
            state.put("permitted", permitted);
            return new JSONObject(state).toString();
        }

        @JavascriptInterface
        public void setReminder(boolean enabled, int interval) {
            runOnUiThread(() -> configureReminder(enabled, interval));
        }
    }
}

