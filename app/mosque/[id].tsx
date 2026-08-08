import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { PrayerTimeline } from '@/components/prayer-timeline';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { usePrayerStore } from '@/context/prayer-store';
import { getMosqueById } from '@/data/mosques';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { useNow } from '@/hooks/use-countdown';
import { getNextPrayer, getPrayerTimeline } from '@/services/prayerTimes';

export default function MosqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = Colors[useAppColorScheme()];
  const now = useNow(30000);
  const { mosqueAlertsEnabled, setMosqueAlertEnabled } = usePrayerStore();
  const mosque = getMosqueById(id);

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
      </ScrollView>
    </ThemedView>
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
});
