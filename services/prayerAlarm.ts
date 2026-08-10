import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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
 *
 * The custom azaan sound on the notification itself (as opposed to the in-app
 * full-screen player) only works in a dev client / production build — the
 * "sounds" config plugin below bundles the file into the native project at
 * prebuild time, which Expo Go can't do. In Expo Go the OS plays its default
 * notification sound instead; that's a platform limitation, not a bug here.
 */

const AZAAN_SOUND_NAME = 'azaan_placeholder'; // matches assets/audio/azaan_placeholder.wav (no hyphens: Android resource names require [a-z0-9_])
const AZAAN_CHANNEL_ID = 'azaan-alerts';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const AZAAN_SOUND = require('@/assets/audio/azaan_placeholder.wav');

let player: AudioPlayer | null = null;
let androidChannelReady: Promise<unknown> | null = null;

function getPlayer(): AudioPlayer {
  if (!player) player = createAudioPlayer(AZAAN_SOUND);
  return player;
}

/** Android 8+ ignores per-notification sound; the sound must live on the channel. */
function ensureAndroidChannel(): Promise<unknown> {
  if (Platform.OS !== 'android') return Promise.resolve();
  if (!androidChannelReady) {
    androidChannelReady = Notifications.setNotificationChannelAsync(AZAAN_CHANNEL_ID, {
      name: 'Prayer Alerts',
      importance: Notifications.AndroidImportance.MAX,
      sound: AZAAN_SOUND_NAME,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  return androidChannelReady;
}

export async function requestAlarmPermissions(): Promise<boolean> {
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

export async function schedulePrayerAlert(id: string, date: Date, title: string, body: string): Promise<void> {
  if (date.getTime() <= Date.now()) return;
  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: { title, body, sound: `${AZAAN_SOUND_NAME}.wav` },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: AZAAN_CHANNEL_ID },
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
