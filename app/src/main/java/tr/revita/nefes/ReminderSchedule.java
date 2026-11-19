package tr.revita.nefes;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZonedDateTime;

final class ReminderSchedule {
    private static final LocalTime START = LocalTime.of(9, 0);
    private static final LocalTime END = LocalTime.of(21, 0);

    private ReminderSchedule() {}

    static ZonedDateTime next(ZonedDateTime now, int interval) {
        if (now.toLocalTime().isBefore(START)) {
            return now.toLocalDate().atTime(START).atZone(now.getZone());
        }
        ZonedDateTime candidate = now.plusMinutes(interval);
        if (!now.toLocalTime().isBefore(END)
                || !candidate.toLocalDate().equals(now.toLocalDate())
                || !candidate.toLocalTime().isBefore(END)) {
            return now.toLocalDate().plusDays(1).atTime(START).atZone(now.getZone());
        }
        return candidate;
    }

    static boolean canDeliver(ZonedDateTime now, long scheduledMillis) {
        LocalTime currentTime = now.toLocalTime();
        Instant scheduled = Instant.ofEpochMilli(scheduledMillis);
        return scheduledMillis > 0
                && !currentTime.isBefore(START)
                && currentTime.isBefore(END)
                && !now.toInstant().isBefore(scheduled)
                && now.toLocalDate().equals(scheduled.atZone(now.getZone()).toLocalDate());
    }
}
