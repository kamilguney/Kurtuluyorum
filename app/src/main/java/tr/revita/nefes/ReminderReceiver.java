package tr.revita.nefes;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import java.time.ZonedDateTime;

public final class ReminderReceiver extends BroadcastReceiver {
    static final String OPEN_WATER = "tr.revita.nefes.OPEN_WATER";
    private static final String ALARM = "tr.revita.nefes.REMINDER_ALARM";
    private static final String CHANNEL = "water";
    private static final String SCHEDULED_AT = "scheduledAt";
    private static final int NOTIFICATION_ID = 1;

    static SharedPreferences settings(Context context) {
        return context.getSharedPreferences("nefes", Context.MODE_PRIVATE);
    }

    static void createChannel(Context context) {
        context.getSystemService(NotificationManager.class).createNotificationChannel(
                new NotificationChannel(CHANNEL, context.getString(R.string.water_channel),
                        NotificationManager.IMPORTANCE_DEFAULT));
    }

    static boolean permitted(Context context) {
        if (Build.VERSION.SDK_INT >= 33
                && context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                   != PackageManager.PERMISSION_GRANTED) {
            return false;
        }
        NotificationManager manager = context.getSystemService(NotificationManager.class);
        NotificationChannel channel = manager.getNotificationChannel(CHANNEL);
        return manager.areNotificationsEnabled()
                && (channel == null || channel.getImportance() != NotificationManager.IMPORTANCE_NONE);
    }

    static int interval(Context context) {
        return settings(context).getInt("interval", 120);
    }

    static boolean enabled(Context context) {
        return settings(context).getBoolean("enabled", false);
    }

    static void configure(Context context, boolean enabled, int interval) {
        settings(context).edit()
                .putBoolean("enabled", enabled)
                .putInt("interval", Math.max(30, Math.min(240, interval)))
                .apply();
        reschedule(context, ZonedDateTime.now());
        if (!enabled) {
            context.getSystemService(NotificationManager.class).cancel(NOTIFICATION_ID);
        }
    }

    static void ensureScheduled(Context context) {
        Intent alarm = new Intent(context, ReminderReceiver.class).setAction(ALARM);
        PendingIntent existing = PendingIntent.getBroadcast(context, 0, alarm,
                PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE);
        if (!enabled(context) || !permitted(context) || existing == null
                || !settings(context).contains(SCHEDULED_AT)) {
            reschedule(context, ZonedDateTime.now());
        }
    }

    private static void reschedule(Context context, ZonedDateTime now) {
        Intent alarm = new Intent(context, ReminderReceiver.class).setAction(ALARM);
        AlarmManager manager = context.getSystemService(AlarmManager.class);
        PendingIntent existing = PendingIntent.getBroadcast(context, 0, alarm,
                PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE);
        if (existing != null) {
            manager.cancel(existing);
            existing.cancel();
        }
        if (enabled(context) && permitted(context)) {
            long trigger = ReminderSchedule.next(now, interval(context)).toInstant().toEpochMilli();
            alarm.putExtra(SCHEDULED_AT, trigger);
            PendingIntent delivery = PendingIntent.getBroadcast(context, 0, alarm,
                    PendingIntent.FLAG_IMMUTABLE);
            settings(context).edit().putLong(SCHEDULED_AT, trigger).apply();
            manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, trigger, delivery);
        } else {
            settings(context).edit().remove(SCHEDULED_AT).apply();
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        ZonedDateTime now = ZonedDateTime.now();
        if (!ALARM.equals(intent.getAction())) {
            reschedule(context, now);
            return;
        }
        long trigger = intent.getLongExtra(SCHEDULED_AT, 0);
        if (trigger <= 0 || trigger != settings(context).getLong(SCHEDULED_AT, 0)) {
            return;
        }
        if (enabled(context) && permitted(context) && ReminderSchedule.canDeliver(now, trigger)) {
            Intent open = new Intent(context, MainActivity.class).setAction(OPEN_WATER)
                    .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent tap = PendingIntent.getActivity(context, 1, open,
                    PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
            Notification notification = new Notification.Builder(context, CHANNEL)
                    .setSmallIcon(R.drawable.ic_water)
                    .setContentTitle(context.getString(R.string.water_title))
                    .setContentText(context.getString(R.string.water_message))
                    .setContentIntent(tap)
                    .setAutoCancel(true)
                    .build();
            context.getSystemService(NotificationManager.class).notify(NOTIFICATION_ID, notification);
        }
        reschedule(context, now);
    }
}
