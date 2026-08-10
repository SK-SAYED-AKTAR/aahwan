import type { Mosque } from '@/types/mosque';

/**
 * Hard-coded MVP data. Shape mirrors what an admin-panel-backed API would
 * eventually return, so swapping this for a fetch() later doesn't require
 * touching any screen — see AGENTS.md section 19-21.
 */
export const MOSQUES: Mosque[] = [
  {
    id: 'sajano-pally-jame-masjid',
    name: 'Sajano Pally Jame Masjid',
    prayers: [
      { name: 'Fajr', time: '01:58' },
      { name: 'Dhuhr', time: '13:05' },
      { name: 'Asr', time: '16:35' },
      { name: 'Maghrib', time: '18:28' },
      { name: 'Isha', time: '19:45' },
    ],
  },
  {
    id: 'police-line-masjid',
    name: 'Police Line Masjid',
    prayers: [
      { name: 'Fajr', time: '04:40' },
      { name: 'Dhuhr', time: '13:10' },
      { name: 'Asr', time: '16:40' },
      { name: 'Maghrib', time: '18:30' },
      { name: 'Isha', time: '19:50' },
    ],
  },
  {
    id: 'suri-markaz-masjid',
    name: 'Suri Markaz Masjid',
    prayers: [
      { name: 'Fajr', time: '04:30' },
      { name: 'Dhuhr', time: '13:00' },
      { name: 'Asr', time: '16:30' },
      { name: 'Maghrib', time: '18:25' },
      { name: 'Isha', time: '19:40' },
    ],
  },
];

export function getMosqueById(id: string): Mosque | undefined {
  return MOSQUES.find((m) => m.id === id);
}
