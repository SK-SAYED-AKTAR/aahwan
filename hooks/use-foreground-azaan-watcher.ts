import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { usePrayerStore } from '@/context/prayer-store';

import { useNow } from './use-countdown';

/**
 * ponytail: a local notification (see use-scheduled-prayer-alerts) covers the
 * background case at OS discretion, but reliably opening our own full-screen
 * azaan UI the instant a prayer hits only works while the app is foregrounded —
 * this polls the clock every 10s and navigates to /azaan, which owns audio
 * playback itself. Upgrade path: native full-screen-intent / critical-alert
 * handling in a dev client build.
 */
export function useForegroundAzaanWatcher() {
  const now = useNow(10000);
  const router = useRouter();
  const { mosques, selectedMosqueIds, mosqueAlertsEnabled, settings, loading } = usePrayerStore();
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (loading || !settings.azaanAlertsEnabled) return;
    const dayKey = now.toDateString();

    for (const mosque of mosques) {
      if (!selectedMosqueIds.includes(mosque.id)) continue;
      if (mosqueAlertsEnabled[mosque.id] === false) continue;
      for (const prayer of mosque.prayers) {
        if (!settings.prayerAlertsEnabled[prayer.name]) continue;
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const isNow = now.getHours() === hours && now.getMinutes() === minutes;
        const key = `${dayKey}-${mosque.id}-${prayer.name}`;
        if (isNow && !firedRef.current.has(key)) {
          firedRef.current.add(key);
          router.push({
            pathname: '/azaan',
            params: { mosqueId: mosque.id, prayer: prayer.name, time: prayer.time },
          });
        }
      }
    }
  }, [now, loading, mosques, selectedMosqueIds, mosqueAlertsEnabled, settings, router]);
}
