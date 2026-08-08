import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { formatCountdown, formatTimeOfDay, type NextPrayer as NextPrayerType } from '@/services/prayerTimes';

export function NextPrayer({ nextPrayer, now }: { nextPrayer: NextPrayerType; now: Date }) {
  const theme = Colors[useAppColorScheme()];

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.eyebrow, { color: theme.primary }]}>
        {nextPrayer.isTomorrow ? 'NEXT PRAYER · TOMORROW' : 'NEXT PRAYER'}
      </ThemedText>
      <ThemedText style={styles.name}>{nextPrayer.prayer}</ThemedText>
      <ThemedText style={styles.time}>{formatTimeOfDay(nextPrayer.time)}</ThemedText>
      <View style={styles.countdownRow}>
        <ThemedText style={[styles.countdownLabel, { color: theme.textSecondary }]}>in</ThemedText>
        <ThemedText style={[styles.countdown, { color: theme.accent }]}>
          {formatCountdown(nextPrayer.date, now)}
        </ThemedText>
      </View>
      <ThemedText style={[styles.mosque, { color: theme.textSecondary }]}>{nextPrayer.mosqueName}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 24 },
  eyebrow: { fontSize: 12, fontWeight: '600', letterSpacing: 1.6 },
  name: { fontSize: 36, fontWeight: '600', marginTop: 12 },
  time: { fontSize: 19, fontWeight: '500', marginTop: 2, fontVariant: ['tabular-nums'] },
  countdownRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 20 },
  countdownLabel: { fontSize: 15 },
  countdown: { fontSize: 22, fontWeight: '700' },
  mosque: { fontSize: 14, marginTop: 12 },
});
