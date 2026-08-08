import type { Mosque } from '@/types/mosque';
import type { PrayerName, PrayerStatus, PrayerTime, TimeOfDay } from '@/types/prayer';

export type NextPrayer = {
  mosqueId: string;
  mosqueName: string;
  prayer: PrayerName;
  time: TimeOfDay;
  date: Date;
  isTomorrow: boolean;
};

function withTimeOnDate(base: Date, time: TimeOfDay): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(base);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Finds the soonest upcoming prayer across every selected mosque. Scans both
 * today and tomorrow for each mosque so Isha -> tomorrow's Fajr rolls over
 * correctly at midnight without special-casing it.
 */
export function getNextPrayer(mosques: Mosque[], selectedIds: string[], now: Date): NextPrayer | null {
  const selected = mosques.filter((m) => selectedIds.includes(m.id));
  if (selected.length === 0) return null;

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let best: NextPrayer | null = null;
  for (const mosque of selected) {
    for (const [dayBase, isTomorrow] of [
      [now, false],
      [tomorrow, true],
    ] as const) {
      for (const prayer of mosque.prayers) {
        const date = withTimeOnDate(dayBase, prayer.time);
        if (date.getTime() <= now.getTime()) continue;
        if (!best || date.getTime() < best.date.getTime()) {
          best = {
            mosqueId: mosque.id,
            mosqueName: mosque.name,
            prayer: prayer.name,
            time: prayer.time,
            date,
            isTomorrow,
          };
        }
      }
    }
  }
  return best;
}

/** Today's five prayers for one mosque, each tagged completed/current/upcoming. */
export function getPrayerTimeline(
  mosque: Mosque,
  now: Date,
  nextPrayer: NextPrayer | null
): Array<PrayerTime & { status: PrayerStatus }> {
  return mosque.prayers.map((prayer) => {
    const date = withTimeOnDate(now, prayer.time);
    const isNext =
      !!nextPrayer && !nextPrayer.isTomorrow && nextPrayer.mosqueId === mosque.id && nextPrayer.prayer === prayer.name;
    const status: PrayerStatus = isNext ? 'current' : date.getTime() <= now.getTime() ? 'completed' : 'upcoming';
    return { ...prayer, status };
  });
}

/** Next Date this time-of-day occurs at or after `now` (today, or tomorrow if already passed). */
export function nextOccurrenceOf(time: TimeOfDay, now: Date): Date {
  const date = withTimeOnDate(now, time);
  if (date.getTime() <= now.getTime()) date.setDate(date.getDate() + 1);
  return date;
}

export function formatTimeOfDay(time: TimeOfDay): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatCountdown(target: Date, now: Date): string {
  const totalMinutes = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'now';
}

export function formatClock(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
}
