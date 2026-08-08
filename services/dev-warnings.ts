import { LogBox } from 'react-native';

/**
 * ponytail: expo-notifications logs a console.error the moment it's imported
 * on Android in Expo Go (SDK 53+ dropped remote/push support there) — we only
 * ever use local, non-push scheduling, so the warning is a false alarm. Must
 * be the first import anywhere in the app (see app/_layout.tsx) so it runs
 * before prayerAlarm.ts pulls expo-notifications in. Drop once the app ships
 * via a dev client / EAS build instead of Expo Go.
 */
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
]);
