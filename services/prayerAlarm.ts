import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';

/**
 * Isolates all azaan playback + alert scheduling behind a small function API
 * (see AGENTS.md section 9) so screens never touch expo-audio/expo-notifications
 * directly, and this file is the only thing that needs to change when a real
 * background-alarm implementation (native module + dev client) replaces the MVP one.
 *
 * ponytail: local notifications are the closest reliable Expo-Go-safe stand-in for
 * a background alarm. They fire even if the app is backgrounded/killed, but iOS/Android
 * both cap how loud/insistent a notification sound can be, and neither guarantees the
 * full-screen azaan UI opens automatically the way a real alarm clock would. The
 * full-screen experience is guaranteed only while the app is foregrounded (see
 * hooks/use-foreground-azaan-watcher.ts). Upgrade path: a config-plugin-based native
 * alarm (e.g. full-screen intent notifications on Android, critical alerts on iOS)
 * behind a dev client build.
 */

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AZAAN_SOUND = require('@/assets/audio/azaan-placeholder.wav');

let player: AudioPlayer | null = null;

function getPlayer(): AudioPlayer {
  if (!player) player = createAudioPlayer(AZAAN_SOUND);
  return player;
}

export async function requestAlarmPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function schedulePrayerAlert(id: string, date: Date, title: string, body: string): Promise<void> {
  if (date.getTime() <= Date.now()) return;
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
  });
}

export async function cancelPrayerAlert(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelAllPrayerAlerts(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function playAzaan(volume = 1): Promise<void> {
  await setAudioModeAsync({ playsInSilentMode: true });
  const p = getPlayer();
  p.loop = true;
  p.volume = Math.max(0, Math.min(1, volume));
  p.seekTo(0);
  p.play();
}

export function stopAzaan(): void {
  player?.pause();
  player?.seekTo(0);
}
