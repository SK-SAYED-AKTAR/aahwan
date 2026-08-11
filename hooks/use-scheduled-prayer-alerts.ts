import { useEffect } from 'react';

import { usePrayerStore } from '@/context/prayer-store';
import { cancelAllPrayerAlerts, requestAlarmPermissions, schedulePrayerAlert } from '@/services/prayerAlarm';
import { formatTimeOfDay, nextOccurrenceOf } from '@/services/prayerTimes';

/** Keeps the device's scheduled local-notification alarms in sync with mosque selection + settings. */
export function useScheduledPrayerAlerts() {
  const { mosques, selectedMosqueIds, mosqueAlertsEnabled, settings, loading } = usePrayerStore();

  useEffect(() => {
    if (loading) return;
    (async () => {
      try {
        await cancelAllPrayerAlerts();
        if (!settings.azaanAlertsEnabled) return;
        if (!(await requestAlarmPermissions())) return;

        const now = new Date();
        for (const mosque of mosques) {
          if (!selectedMosqueIds.includes(mosque.id)) continue;
          if (mosqueAlertsEnabled[mosque.id] === false) continue;
          for (const prayer of mosque.prayers) {
            if (!settings.prayerAlertsEnabled[prayer.name]) continue;
            await schedulePrayerAlert(
              `${mosque.id}-${prayer.name}`,
              nextOccurrenceOf(prayer.time, now),
              `${prayer.name} — ${mosque.name}`,
              `It's time for ${prayer.name}, ${formatTimeOfDay(prayer.time)}.`
            );
          }
        }
      } catch {
        // ponytail: background alarms are best-effort in Expo Go (see
        // services/prayerAlarm.ts) — the foreground watcher still covers the
        // app-open case, so a scheduling failure here shouldn't break the app.
      }
    })();
  }, [mosques, selectedMosqueIds, mosqueAlertsEnabled, settings, loading]);
}
