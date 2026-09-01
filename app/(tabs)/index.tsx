import { Redirect } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyMosqueState } from '@/components/empty-state';
import { MosqueTimelinePager } from '@/components/mosque-timeline-pager';
import { NextPrayer } from '@/components/next-prayer';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { usePrayerStore } from '@/context/prayer-store';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { useNextPrayer } from '@/hooks/use-next-prayer';
import { formatClock, formatDateLong } from '@/services/prayerTimes';

const CONTENT_PADDING = 24;

export default function HomeScreen() {
  const theme = Colors[useAppColorScheme()];
  const { mosques, selectedMosqueIds, loading, hasOnboarded } = usePrayerStore();
  const { now, nextPrayer } = useNextPrayer();
  const { width } = useWindowDimensions();

  const selectedMosques = useMemo(
    () => mosques.filter((m) => selectedMosqueIds.includes(m.id)),
    [mosques, selectedMosqueIds]
  );

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
              {selectedMosques.length > 0 && (
                <View style={styles.section}>
                  <MosqueTimelinePager
                    mosques={selectedMosques}
                    now={now}
                    initialMosqueId={nextPrayer?.mosqueId}
                    pageWidth={width - CONTENT_PADDING * 2}
                  />
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
  content: { paddingHorizontal: CONTENT_PADDING, paddingBottom: 40, paddingTop: 12 },
  clockBlock: { alignItems: 'center', paddingVertical: 20 },
  clock: { fontSize: 52, fontWeight: '300', letterSpacing: 0.5, fontVariant: ['tabular-nums'] },
  date: { fontSize: 15, marginTop: 4 },
  section: { marginTop: 28 },
});
