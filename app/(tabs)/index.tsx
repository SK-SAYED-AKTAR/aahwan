import { Redirect } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyMosqueState } from '@/components/empty-state';
import { NextPrayer } from '@/components/next-prayer';
import { PrayerTimeline } from '@/components/prayer-timeline';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { usePrayerStore } from '@/context/prayer-store';
import { getMosqueById } from '@/data/mosques';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { useNextPrayer } from '@/hooks/use-next-prayer';
import { formatClock, formatDateLong, getPrayerTimeline } from '@/services/prayerTimes';

export default function HomeScreen() {
  const theme = Colors[useAppColorScheme()];
  const { selectedMosqueIds, loading, hasOnboarded } = usePrayerStore();
  const { now, nextPrayer } = useNextPrayer();

  const timelineMosque = useMemo(() => {
    if (nextPrayer) return getMosqueById(nextPrayer.mosqueId);
    return selectedMosqueIds.length ? getMosqueById(selectedMosqueIds[0]) : undefined;
  }, [nextPrayer, selectedMosqueIds]);

  const timeline = timelineMosque ? getPrayerTimeline(timelineMosque, now, nextPrayer) : [];

  if (loading) return <ThemedView style={styles.flex} />;
  if (!hasOnboarded) return <Redirect href="/onboarding" />;

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.clockBlock}>
            <ThemedText style={styles.clock}>{formatClock(now)}</ThemedText>
            <ThemedText style={[styles.date, { color: theme.textSecondary }]}>{formatDateLong(now)}</ThemedText>
          </View>

          {selectedMosqueIds.length === 0 ? (
            <EmptyMosqueState />
          ) : (
            <>
              {nextPrayer && <NextPrayer nextPrayer={nextPrayer} now={now} />}
              {timelineMosque && (
                <View style={styles.section}>
                  <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                    TODAY · {timelineMosque.name.toUpperCase()}
                  </ThemedText>
                  <PrayerTimeline prayers={timeline} />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12 },
  clockBlock: { alignItems: 'center', paddingVertical: 20 },
  clock: { fontSize: 52, fontWeight: '300', letterSpacing: 0.5, fontVariant: ['tabular-nums'] },
  date: { fontSize: 15, marginTop: 4 },
  section: { marginTop: 28, gap: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1.2 },
});
