import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';

export function EmptyMosqueState() {
  const theme = Colors[useAppColorScheme()];
  const router = useRouter();

  return (
    <View style={styles.container}>
      <IconSymbol name="moon.fill" size={28} color={theme.accent} />
      <ThemedText style={styles.title}>Choose your mosque</ThemedText>
      <ThemedText style={[styles.body, { color: theme.textSecondary }]}>
        Select one or more mosques to receive prayer times and Azaan alerts.
      </ThemedText>
      <Pressable
        onPress={() => router.push('/mosques')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 }]}>
        <ThemedText style={styles.buttonText}>Choose Mosques</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32, gap: 12 },
  title: { fontSize: 20, fontWeight: '600', marginTop: 6 },
  body: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  button: { marginTop: 12, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 100, minHeight: 44 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
