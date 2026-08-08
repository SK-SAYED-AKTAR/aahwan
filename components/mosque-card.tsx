import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';

type Props = {
  name: string;
  prayerCount: number;
  selected: boolean;
  onToggle: () => void;
  onPressDetails: () => void;
};

export function MosqueCard({ name, prayerCount, selected, onToggle, onPressDetails }: Props) {
  const theme = Colors[useAppColorScheme()];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: selected ? theme.primary : theme.border },
      ]}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={name}
        style={styles.tapArea}
        hitSlop={4}>
        <IconSymbol
          name={selected ? 'checkmark.circle.fill' : 'circle'}
          size={24}
          color={selected ? theme.primary : theme.icon}
        />
        <View style={styles.text}>
          <ThemedText style={styles.name}>{name}</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {prayerCount} prayers configured
          </ThemedText>
        </View>
      </Pressable>
      <Pressable
        onPress={onPressDetails}
        accessibilityRole="button"
        accessibilityLabel={`View ${name} details`}
        hitSlop={12}
        style={styles.chevron}>
        <IconSymbol name="chevron.right" size={18} color={theme.icon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 4,
    paddingRight: 8,
  },
  tapArea: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14 },
  text: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 13 },
  chevron: { padding: 10 },
});
