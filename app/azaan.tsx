import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { usePrayerStore } from '@/context/prayer-store';
import { getMosqueById } from '@/data/mosques';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { playAzaan, stopAzaan } from '@/services/prayerAlarm';
import { formatTimeOfDay } from '@/services/prayerTimes';
import type { PrayerName } from '@/types/prayer';

export default function AzaanScreen() {
  const { mosqueId, prayer, time } = useLocalSearchParams<{ mosqueId: string; prayer: PrayerName; time: string }>();
  const theme = Colors[useAppColorScheme()];
  const router = useRouter();
  const { settings } = usePrayerStore();
  const mosqueName = mosqueId ? getMosqueById(mosqueId)?.name : undefined;

  useEffect(() => {
    playAzaan(settings.volume);
    return stopAzaan;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    stopAzaan();
    router.back();
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <IconSymbol name="moon.fill" size={34} color={theme.accent} />
          <ThemedText style={[styles.prayer, { color: theme.text }]}>{(prayer ?? '').toUpperCase()}</ThemedText>
          <ThemedText style={[styles.time, { color: theme.text }]}>{time ? formatTimeOfDay(time) : ''}</ThemedText>
          {!!mosqueName && <ThemedText style={[styles.mosque, { color: theme.textSecondary }]}>{mosqueName}</ThemedText>}
          <ThemedText style={[styles.tagline, { color: theme.textSecondary }]}>It&apos;s prayer time</ThemedText>
        </View>

        <Pressable
          onPress={dismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss prayer alert"
          style={({ pressed }) => [
            styles.dismiss,
            { borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={[styles.dismissText, { color: theme.text }]}>Dismiss</ThemedText>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32 },
  prayer: { fontSize: 15, fontWeight: '600', letterSpacing: 3, marginTop: 20 },
  time: { fontSize: 44, fontWeight: '300', marginTop: 6, fontVariant: ['tabular-nums'] },
  mosque: { fontSize: 15, marginTop: 18 },
  tagline: { fontSize: 15, marginTop: 4 },
  dismiss: {
    marginHorizontal: 32,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 100,
    borderWidth: 1.5,
    alignItems: 'center',
    minHeight: 44,
  },
  dismissText: { fontSize: 16, fontWeight: '600' },
});
