import { useColorScheme as useSystemColorScheme } from 'react-native';

import { usePrayerStore } from '@/context/prayer-store';

/** Resolves the user's Appearance setting (system/light/dark) against the device scheme. */
export function useAppColorScheme(): 'light' | 'dark' {
  const system = useSystemColorScheme();
  const { settings } = usePrayerStore();
  if (settings.themePreference === 'system') return system ?? 'light';
  return settings.themePreference;
}
