import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { MOSQUES } from '@/data/mosques';
import { readJSON, writeJSON } from '@/services/storage';
import type { Mosque } from '@/types/mosque';
import type { PrayerName, TimeOfDay } from '@/types/prayer';

export type ThemePreference = 'system' | 'light' | 'dark';

// ponytail: hardcoded single-admin credentials — there's no backend, so this
// is a local gate rather than real auth. Upgrade path: real auth once there's
// a server to check against.
const ADMIN_EMAIL = 'sayed@aktar.com';
const ADMIN_PASSWORD = 'Sayed@123';

type MosqueOverrides = Record<string, Partial<Record<PrayerName, TimeOfDay>>>;

export type AppSettings = {
  azaanAlertsEnabled: boolean;
  prayerAlertsEnabled: Record<PrayerName, boolean>;
  volume: number;
  themePreference: ThemePreference;
};

const DEFAULT_SETTINGS: AppSettings = {
  azaanAlertsEnabled: true,
  prayerAlertsEnabled: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
  volume: 0.8,
  themePreference: 'system',
};

type PrayerStore = {
  loading: boolean;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  selectedMosqueIds: string[];
  toggleMosque: (id: string) => void;
  selectAllMosques: () => void;
  clearMosques: () => void;
  mosqueAlertsEnabled: Record<string, boolean>;
  setMosqueAlertEnabled: (id: string, enabled: boolean) => void;
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  setPrayerAlertEnabled: (prayer: PrayerName, enabled: boolean) => void;
  mosques: Mosque[];
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updatePrayerTime: (mosqueId: string, prayer: PrayerName, time: TimeOfDay) => void;
};

const PrayerStoreContext = createContext<PrayerStore | null>(null);

const KEYS = {
  onboarded: 'onboarded',
  selectedMosques: 'selectedMosqueIds',
  mosqueAlerts: 'mosqueAlertsEnabled',
  settings: 'settings',
  isAdmin: 'isAdmin',
  mosqueOverrides: 'mosqueOverrides',
};

export function PrayerStoreProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [selectedMosqueIds, setSelectedMosqueIds] = useState<string[]>([]);
  const [mosqueAlertsEnabled, setMosqueAlertsEnabled] = useState<Record<string, boolean>>({});
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mosqueOverrides, setMosqueOverrides] = useState<MosqueOverrides>({});

  useEffect(() => {
    (async () => {
      const [onboarded, mosqueIds, alerts, storedSettings, admin, overrides] = await Promise.all([
        readJSON(KEYS.onboarded, false),
        readJSON<string[]>(KEYS.selectedMosques, []),
        readJSON<Record<string, boolean>>(KEYS.mosqueAlerts, {}),
        readJSON<AppSettings>(KEYS.settings, DEFAULT_SETTINGS),
        readJSON(KEYS.isAdmin, false),
        readJSON<MosqueOverrides>(KEYS.mosqueOverrides, {}),
      ]);
      setHasOnboarded(onboarded);
      setSelectedMosqueIds(mosqueIds);
      setMosqueAlertsEnabled(alerts);
      setSettings(storedSettings);
      setIsAdmin(admin);
      setMosqueOverrides(overrides);
      setLoading(false);
    })();
  }, []);

  const mosques = useMemo<Mosque[]>(
    () =>
      MOSQUES.map((mosque) => ({
        ...mosque,
        prayers: mosque.prayers.map((prayer) => ({
          ...prayer,
          time: mosqueOverrides[mosque.id]?.[prayer.name] ?? prayer.time,
        })),
      })),
    [mosqueOverrides]
  );

  const completeOnboarding = () => {
    setHasOnboarded(true);
    writeJSON(KEYS.onboarded, true);
  };

  const toggleMosque = (id: string) => {
    setSelectedMosqueIds((prev) => {
      const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      writeJSON(KEYS.selectedMosques, next);
      return next;
    });
  };

  const selectAllMosques = () => {
    const all = MOSQUES.map((m) => m.id);
    setSelectedMosqueIds(all);
    writeJSON(KEYS.selectedMosques, all);
  };

  const clearMosques = () => {
    setSelectedMosqueIds([]);
    writeJSON(KEYS.selectedMosques, []);
  };

  const setMosqueAlertEnabled = (id: string, enabled: boolean) => {
    setMosqueAlertsEnabled((prev) => {
      const next = { ...prev, [id]: enabled };
      writeJSON(KEYS.mosqueAlerts, next);
      return next;
    });
  };

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeJSON(KEYS.settings, next);
      return next;
    });
  };

  const setPrayerAlertEnabled = (prayer: PrayerName, enabled: boolean) => {
    setSettings((prev) => {
      const next = { ...prev, prayerAlertsEnabled: { ...prev.prayerAlertsEnabled, [prayer]: enabled } };
      writeJSON(KEYS.settings, next);
      return next;
    });
  };

  const login = (email: string, password: string): boolean => {
    const ok = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
    if (ok) {
      setIsAdmin(true);
      writeJSON(KEYS.isAdmin, true);
    }
    return ok;
  };

  const logout = () => {
    setIsAdmin(false);
    writeJSON(KEYS.isAdmin, false);
  };

  const updatePrayerTime = (mosqueId: string, prayer: PrayerName, time: TimeOfDay) => {
    setMosqueOverrides((prev) => {
      const next = { ...prev, [mosqueId]: { ...prev[mosqueId], [prayer]: time } };
      writeJSON(KEYS.mosqueOverrides, next);
      return next;
    });
  };

  const value = useMemo<PrayerStore>(
    () => ({
      loading,
      hasOnboarded,
      completeOnboarding,
      selectedMosqueIds,
      toggleMosque,
      selectAllMosques,
      clearMosques,
      mosqueAlertsEnabled,
      setMosqueAlertEnabled,
      settings,
      updateSettings,
      setPrayerAlertEnabled,
      mosques,
      isAdmin,
      login,
      logout,
      updatePrayerTime,
    }),
    [loading, hasOnboarded, selectedMosqueIds, mosqueAlertsEnabled, settings, mosques, isAdmin]
  );

  return <PrayerStoreContext.Provider value={value}>{children}</PrayerStoreContext.Provider>;
}

export function usePrayerStore() {
  const ctx = useContext(PrayerStoreContext);
  if (!ctx) throw new Error('usePrayerStore must be used within PrayerStoreProvider');
  return ctx;
}
