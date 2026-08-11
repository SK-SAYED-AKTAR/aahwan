import { LogBox } from 'react-native';

/**
 * ponytail: expo-notifications logs a console.warn + console.error the moment
 * it's imported on Android in Expo Go (SDK 53+ dropped remote/push support
 * there) — we only ever use local, non-push scheduling, so both are false
 * alarms. Must be the first import anywhere in the app (see app/_layout.tsx)
 * so it runs before prayerAlarm.ts pulls expo-notifications in. Drop once the
 * app ships via a dev client / EAS build instead of Expo Go.
 *
 * LogBox.ignoreLogs only hides the in-app overlay — Metro's terminal mirrors
 * the device console independently, so the messages still print there unless
 * console.warn/error are patched directly too.
 */
const IGNORED_SUBSTRINGS = [
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
  '`expo-notifications` functionality is not fully supported in Expo Go',
];

LogBox.ignoreLogs(IGNORED_SUBSTRINGS);

function silence(method: 'warn' | 'error') {
  const original = console[method];
  console[method] = (...args: unknown[]) => {
    const first = args[0];
    if (typeof first === 'string' && IGNORED_SUBSTRINGS.some((s) => first.includes(s))) return;
    original(...args);
  };
}

silence('warn');
silence('error');
