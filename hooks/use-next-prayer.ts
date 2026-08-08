import { useMemo } from 'react';

import { usePrayerStore } from '@/context/prayer-store';
import { MOSQUES } from '@/data/mosques';
import { getNextPrayer } from '@/services/prayerTimes';

import { useNow } from './use-countdown';

export function useNextPrayer() {
  const now = useNow();
  const { selectedMosqueIds } = usePrayerStore();
  const nextPrayer = useMemo(
    () => getNextPrayer(MOSQUES, selectedMosqueIds, now),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMosqueIds, now.getMinutes(), now.getHours(), now.getDate()]
  );
  return { now, nextPrayer };
}
