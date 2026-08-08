export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export const PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/** 24-hour "HH:mm" time-of-day, e.g. "04:35" or "13:05". */
export type TimeOfDay = string;

export type PrayerTime = {
  name: PrayerName;
  time: TimeOfDay;
};

export type PrayerStatus = 'completed' | 'current' | 'upcoming';
