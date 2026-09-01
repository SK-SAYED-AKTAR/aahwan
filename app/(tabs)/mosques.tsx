import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MosqueCard } from '@/components/mosque-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { usePrayerStore } from '@/context/prayer-store';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';

export default function MosquesScreen() {
  const theme = Colors[useAppColorScheme()];
  const router = useRouter();
  const { mosques, selectedMosqueIds, toggleMosque, selectAllMosques } = usePrayerStore();
  const allSelected = selectedMosqueIds.length === mosques.length;

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <FlatList
          data={mosques}
          keyExtractor={(mosque) => mosque.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText style={styles.title}>My Mosques</ThemedText>
              <View style={styles.subtitleRow}>
                <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Choose the mosques you want alerts from.
                </ThemedText>
                <Pressable onPress={selectAllMosques} hitSlop={8}>
                  <ThemedText style={[styles.selectAll, { color: theme.primary }]}>
                    {allSelected ? 'All selected' : 'Select all'}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <MosqueCard
              name={item.name}
              prayerCount={item.prayers.length}
              selected={selectedMosqueIds.includes(item.id)}
              onToggle={() => toggleMosque(item.id)}
              onPressDetails={() => router.push(`/mosque/${item.id}`)}
            />
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { paddingTop: 8, paddingBottom: 20, gap: 6 },
  title: { fontSize: 26, fontWeight: '600' },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subtitle: { fontSize: 15, flexShrink: 1 },
  selectAll: { fontSize: 14, fontWeight: '600' },
});
