import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { formatTimeOfDay } from '@/services/prayerTimes';
import type { PrayerStatus, PrayerTime } from '@/types/prayer';

type Row = PrayerTime & { status: PrayerStatus };

export function PrayerTimeline({ prayers }: { prayers: Row[] }) {
  const theme = Colors[useAppColorScheme()];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {prayers.map((prayer, index) => {
        const isCurrent = prayer.status === 'current';
        const isCompleted = prayer.status === 'completed';
        return (
          <View
            key={prayer.name}
            style={[
              styles.row,
              index < prayers.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.border,
              },
            ]}>
            <View style={styles.rowLeft}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isCurrent ? theme.primary : theme.textSecondary,
                    opacity: isCurrent ? 1 : isCompleted ? 0.3 : 0.55,
                  },
                ]}
              />
              <ThemedText
                style={[
                  styles.name,
                  { color: isCompleted ? theme.textSecondary : theme.text, fontWeight: isCurrent ? '700' : '500' },
                ]}>
                {prayer.name}
              </ThemedText>
            </View>
            <ThemedText
              style={[
                styles.time,
                {
                  color: isCurrent ? theme.primary : isCompleted ? theme.textSecondary : theme.text,
                  fontWeight: isCurrent ? '700' : '400',
                },
              ]}>
              {formatTimeOfDay(prayer.time)}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  name: { fontSize: 16 },
  time: { fontSize: 16, fontVariant: ['tabular-nums'] },
});
