import type { PrayerTime } from './prayer';

export type Mosque = {
  id: string;
  name: string;
  prayers: PrayerTime[];
};
