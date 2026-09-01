import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

import { PrayerTimeline } from '@/components/prayer-timeline';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { usePrayerStore } from '@/context/prayer-store';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { useNow } from '@/hooks/use-countdown';
import { getNextPrayer, getPrayerTimeline } from '@/services/prayerTimes';
import type { PrayerName, TimeOfDay } from '@/types/prayer';

const TIME_FORMAT = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function MosqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors[useAppColorScheme()];
  const now = useNow(30000);
  const { mosques, mosqueAlertsEnabled, setMosqueAlertEnabled, isAdmin, updatePrayerTime } = usePrayerStore();
  const mosque = mosques.find((m) => m.id === id);

  if (!mosque) {
    return (
      <ThemedView style={styles.flex}>
        <ThemedText style={styles.notFound}>Mosque not found.</ThemedText>
      </ThemedView>
    );
  }

  const nextPrayer = getNextPrayer([mosque], [mosque.id], now);
  const timeline = getPrayerTimeline(mosque, now, nextPrayer);
  const alertsEnabled = mosqueAlertsEnabled[mosque.id] !== false;

  return (
    <ThemedView style={styles.flex}>
      <Stack.Screen options={{ title: mosque.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          TODAY&apos;S PRAYER TIMES
        </ThemedText>
        <PrayerTimeline prayers={timeline} />

        <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 32 }]}>
          PRAYER ALERTS
        </ThemedText>
        <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.rowText}>
            <ThemedText style={styles.rowTitle}>Receive Azaan alerts</ThemedText>
            <ThemedText style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
              Get notified for every prayer at this mosque.
            </ThemedText>
          </View>
          <Switch
            value={alertsEnabled}
            onValueChange={(value) => setMosqueAlertEnabled(mosque.id, value)}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#fff"
          />
        </View>

        {isAdmin && (
          <>
            <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 32 }]}>
              EDIT PRAYER TIMES
            </ThemedText>
            <View style={[styles.editCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {mosque.prayers.map((prayer, index) => (
                <PrayerTimeEditRow
                  key={prayer.name}
                  theme={theme}
                  name={prayer.name}
                  time={prayer.time}
                  isLast={index === mosque.prayers.length - 1}
                  onSave={(time) => updatePrayerTime(mosque.id, prayer.name, time)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

function PrayerTimeEditRow({
  theme,
  name,
  time,
  isLast,
  onSave,
}: {
  theme: (typeof Colors)['light'];
  name: PrayerName;
  time: TimeOfDay;
  isLast: boolean;
  onSave: (time: TimeOfDay) => void;
}) {
  const [value, setValue] = useState(time);
  const invalid = value !== time && !TIME_FORMAT.test(value);

  const commit = () => {
    if (TIME_FORMAT.test(value)) {
      onSave(value);
    } else {
      setValue(time);
    }
  };

  return (
    <View
      style={[
        styles.editRow,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
      ]}>
      <ThemedText style={styles.rowTitle}>{name}</ThemedText>
      <TextInput
        value={value}
        onChangeText={setValue}
        onBlur={commit}
        onSubmitEditing={commit}
        placeholder="HH:MM"
        placeholderTextColor={theme.textSecondary}
        keyboardType="numbers-and-punctuation"
        maxLength={5}
        style={[
          styles.editInput,
          { color: invalid ? '#B4423C' : theme.text, borderColor: invalid ? '#B4423C' : theme.border },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  notFound: { padding: 20, textAlign: 'center' },
  sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1.2, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    minHeight: 44,
  },
  rowText: { flex: 1, gap: 3, paddingRight: 12 },
  rowTitle: { fontSize: 16, fontWeight: '500' },
  rowSubtitle: { fontSize: 13 },
  editCard: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  editInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    minWidth: 80,
    textAlign: 'center',
  },
});
