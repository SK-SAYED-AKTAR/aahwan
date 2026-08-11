import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdminLoginForm } from '@/components/admin-login-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { type ThemePreference, usePrayerStore } from '@/context/prayer-store';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { playAzaan, stopAzaan } from '@/services/prayerAlarm';
import { PRAYER_NAMES } from '@/types/prayer';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const theme = Colors[useAppColorScheme()];
  const { settings, updateSettings, setPrayerAlertEnabled, isAdmin, logout } = usePrayerStore();
  const [isTesting, setIsTesting] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => stopAzaan, []);

  const toggle = (fn: () => void) => {
    Haptics.selectionAsync();
    fn();
  };

  const handleTestAzaan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isTesting) {
      stopAzaan();
      setIsTesting(false);
    } else {
      playAzaan(settings.volume);
      setIsTesting(true);
    }
  };

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.title}>Settings</ThemedText>

          <Section title="Account" theme={theme}>
            {isAdmin ? (
              <>
                <View style={styles.row}>
                  <View style={styles.testRow}>
                    <IconSymbol name="checkmark.circle.fill" size={18} color={theme.primary} />
                    <ThemedText style={styles.rowLabel}>Signed in as Admin</ThemedText>
                  </View>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.border }]} />
                <Pressable
                  onPress={() => toggle(logout)}
                  style={styles.row}
                  accessibilityRole="button"
                  accessibilityLabel="Log out">
                  <ThemedText style={[styles.rowLabel, { color: theme.accent }]}>Log out</ThemedText>
                </Pressable>
              </>
            ) : showLogin ? (
              <View style={styles.accountForm}>
                <AdminLoginForm onSuccess={() => setShowLogin(false)} />
              </View>
            ) : (
              <Pressable
                onPress={() => setShowLogin(true)}
                style={styles.row}
                accessibilityRole="button"
                accessibilityLabel="Sign in as admin">
                <ThemedText style={[styles.rowLabel, { color: theme.primary }]}>Sign in as Admin</ThemedText>
              </Pressable>
            )}
          </Section>

          <Section title="Prayer Alerts" theme={theme}>
            <ToggleRow
              theme={theme}
              label="Azaan alerts"
              value={settings.azaanAlertsEnabled}
              onValueChange={(v) => toggle(() => updateSettings({ azaanAlertsEnabled: v }))}
              isLast={false}
            />
            {PRAYER_NAMES.map((name, index) => (
              <ToggleRow
                key={name}
                theme={theme}
                label={name}
                value={settings.prayerAlertsEnabled[name]}
                onValueChange={(v) => toggle(() => setPrayerAlertEnabled(name, v))}
                disabled={!settings.azaanAlertsEnabled}
                isLast={index === PRAYER_NAMES.length - 1}
              />
            ))}
          </Section>

          <Section title="Sound" theme={theme}>
            <View style={styles.row}>
              <ThemedText style={styles.rowLabel}>Azaan sound</ThemedText>
              <ThemedText style={{ color: theme.textSecondary }}>Default</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.row}>
              <ThemedText style={styles.rowLabel}>Volume</ThemedText>
              <VolumeBars
                theme={theme}
                value={settings.volume}
                onChange={(v) => updateSettings({ volume: v })}
              />
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Pressable
              onPress={handleTestAzaan}
              style={styles.row}
              accessibilityRole="button"
              accessibilityLabel={isTesting ? 'Stop test azaan' : 'Test azaan'}>
              <View style={styles.testRow}>
                <IconSymbol name={isTesting ? 'xmark' : 'play.fill'} size={16} color={theme.primary} />
                <ThemedText style={[styles.rowLabel, { color: theme.primary }]}>
                  {isTesting ? 'Stop' : 'Test Azaan'}
                </ThemedText>
              </View>
            </Pressable>
          </Section>

          <Section title="Appearance" theme={theme}>
            <View style={styles.segmented}>
              {THEME_OPTIONS.map((option) => {
                const active = settings.themePreference === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => toggle(() => updateSettings({ themePreference: option.value }))}
                    style={[
                      styles.segment,
                      { backgroundColor: active ? theme.primary : 'transparent' },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <ThemedText style={{ color: active ? '#fff' : theme.text, fontWeight: '600', fontSize: 14 }}>
                      {option.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </Section>

          <Section title="About" theme={theme}>
            <View style={styles.row}>
              <ThemedText style={styles.rowLabel}>App version</ThemedText>
              <ThemedText style={{ color: theme.textSecondary }}>{Constants.expoConfig?.version ?? '1.0.0'}</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <ThemedText style={[styles.about, { color: theme.textSecondary }]}>
              Aahwan connects you to your local mosques so you never miss a prayer — clean, calm, and built to be
              trusted five times a day.
            </ThemedText>
          </Section>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function Section({ title, theme, children }: { title: string; theme: (typeof Colors)['light']; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title.toUpperCase()}</ThemedText>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>{children}</View>
    </View>
  );
}

function ToggleRow({
  theme,
  label,
  value,
  onValueChange,
  disabled,
  isLast,
}: {
  theme: (typeof Colors)['light'];
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  isLast: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border }]}>
      <ThemedText style={[styles.rowLabel, disabled && { color: theme.textSecondary }]}>{label}</ThemedText>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

function VolumeBars({
  theme,
  value,
  onChange,
}: {
  theme: (typeof Colors)['light'];
  value: number;
  onChange: (v: number) => void;
}) {
  const levels = [0.2, 0.4, 0.6, 0.8, 1];
  return (
    <View style={styles.volumeRow}>
      {levels.map((level, index) => (
        <Pressable
          key={level}
          onPress={() => onChange(level)}
          hitSlop={6}
          accessibilityRole="adjustable"
          accessibilityLabel={`Volume ${Math.round(level * 100)}%`}
          style={[
            styles.volumeBar,
            {
              height: 10 + index * 4,
              backgroundColor: value >= level ? theme.primary : theme.border,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
  title: { fontSize: 26, fontWeight: '600', marginBottom: 20 },
  section: { marginBottom: 24, gap: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1.2, marginLeft: 4 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  rowLabel: { fontSize: 16 },
  accountForm: { padding: 16 },
  divider: { height: StyleSheet.hairlineWidth },
  testRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  segmented: { flexDirection: 'row', padding: 4, gap: 4 },
  segment: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  volumeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  volumeBar: { width: 6, borderRadius: 3 },
  about: { fontSize: 14, lineHeight: 21, padding: 16, paddingTop: 12 },
});
