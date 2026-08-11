import { useMemo } from 'react';

import { usePrayerStore } from '@/context/prayer-store';
import { getNextPrayer } from '@/services/prayerTimes';

import { useNow } from './use-countdown';

export function useNextPrayer() {
  const now = useNow();
  const { mosques, selectedMosqueIds } = usePrayerStore();
  const nextPrayer = useMemo(
    () => getNextPrayer(mosques, selectedMosqueIds, now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mosques, selectedMosqueIds, now.getMinutes(), now.getHours(), now.getDate()]
  );
  return { now, nextPrayer };
}
