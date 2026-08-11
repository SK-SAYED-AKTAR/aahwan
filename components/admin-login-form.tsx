import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { usePrayerStore } from '@/context/prayer-store';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';

/** Hardcoded single-admin sign-in (see context/prayer-store.tsx) — used by onboarding and Settings. */
export function AdminLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const theme = Colors[useAppColorScheme()];
  const { login } = usePrayerStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (login(email, password)) {
      setError(null);
      onSuccess();
    } else {
      setError('Incorrect email or password.');
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
        onSubmitEditing={submit}
      />
      {error && <ThemedText style={[styles.error, { color: '#B4423C' }]}>{error}</ThemedText>}
      <Pressable
        onPress={submit}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 }]}>
        <ThemedText style={styles.buttonText}>Sign In</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, minHeight: 44 },
  error: { fontSize: 13 },
  button: { paddingVertical: 16, borderRadius: 100, alignItems: 'center', minHeight: 44 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
