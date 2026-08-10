import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';

import { PrayerTimeline } from '@/components/prayer-timeline';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { getNextPrayer, getPrayerTimeline } from '@/services/prayerTimes';
import type { Mosque } from '@/types/mosque';

type Props = {
  mosques: Mosque[];
  now: Date;
  initialMosqueId?: string;
  pageWidth: number;
};

/** Swipeable "Today's Prayer Times" — one page per selected mosque, each with its own status highlighting. */
export function MosqueTimelinePager({ mosques, now, initialMosqueId, pageWidth }: Props) {
  const theme = Colors[useAppColorScheme()];
  const listRef = useRef<FlatList<Mosque>>(null);
  const initialIndex = Math.max(0, mosques.findIndex((m) => m.id === initialMosqueId));
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth));
  };

  const goTo = (index: number) => {
    setActiveIndex(index);
    listRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View>
      <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        TODAY · {mosques[activeIndex]?.name.toUpperCase()}
      </ThemedText>

      <FlatList
        ref={listRef}
        data={mosques}
        keyExtractor={(mosque) => mosque.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({ length: pageWidth, offset: pageWidth * index, index })}
        style={{ width: pageWidth }}
        renderItem={({ item }) => (
          <View style={{ width: pageWidth }}>
            <PrayerTimeline prayers={getPrayerTimeline(item, now, getNextPrayer([item], [item.id], now))} />
          </View>
        )}
      />

      {mosques.length > 1 && (
        <View style={styles.dots}>
          {mosques.map((mosque, index) => (
            <Pressable
              key={mosque.id}
              onPress={() => goTo(index)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`Show ${mosque.name}`}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: index === activeIndex ? theme.primary : theme.border },
                ]}
              />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1.2, marginBottom: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 14 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
