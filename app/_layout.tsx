import '@/services/dev-warnings';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { PrayerStoreProvider } from '@/context/prayer-store';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { useForegroundAzaanWatcher } from '@/hooks/use-foreground-azaan-watcher';
import { useScheduledPrayerAlerts } from '@/hooks/use-scheduled-prayer-alerts';

export const unstable_settings = {
  anchor: '(tabs)',
};

function PrayerAlertsController() {
  useScheduledPrayerAlerts();
  useForegroundAzaanWatcher();
  return null;
}

function RootNavigator() {
  const colorScheme = useAppColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PrayerAlertsController />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen
          name="mosque/[id]"
          options={{ presentation: 'modal', title: 'Mosque' }}
        />
        <Stack.Screen
          name="azaan"
          options={{ presentation: 'fullScreenModal', headerShown: false, gestureEnabled: false }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <PrayerStoreProvider>
      <RootNavigator />
    </PrayerStoreProvider>
  );
}
