import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin JSON wrapper around AsyncStorage. Kept dumb on purpose — domain
 * shape/defaults live in context/prayer-store.tsx, not here, so this stays
 * swappable for SecureStore/a server sync layer without touching callers.
 */
const PREFIX = 'aahwan.';

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
}
