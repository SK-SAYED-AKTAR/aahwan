import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdminLoginForm } from '@/components/admin-login-form';
import { MosqueCard } from '@/components/mosque-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { usePrayerStore } from '@/context/prayer-store';
import { useAppColorScheme } from '@/hooks/use-app-color-scheme';

export default function OnboardingScreen() {
  const theme = Colors[useAppColorScheme()];
  const router = useRouter();
  const { completeOnboarding, mosques, selectedMosqueIds, toggleMosque, selectAllMosques } = usePrayerStore();
  const [step, setStep] = useState<'welcome' | 'login' | 'select'>('welcome');
  const allSelected = selectedMosqueIds.length === mosques.length;

  const finish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  if (step === 'welcome') {
    return (
      <ThemedView style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <View style={styles.welcomeContent}>
            <IconSymbol name="moon.fill" size={36} color={theme.accent} />
            <ThemedText style={styles.headline}>Prayer, your way.</ThemedText>
            <ThemedText style={[styles.subhead, { color: theme.textSecondary }]}>
              Connect with your local mosque and never miss a prayer.
            </ThemedText>
          </View>
          <View style={styles.welcomeFooter}>
            <Pressable
              onPress={() => setStep('login')}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
              ]}>
              <ThemedText style={styles.primaryButtonText}>Sign In</ThemedText>
            </Pressable>
            <Pressable onPress={finish} hitSlop={8} style={styles.skip} accessibilityRole="button">
              <ThemedText style={[styles.skipText, { color: theme.textSecondary }]}>Skip for now</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (step === 'login') {
    return (
      <ThemedView style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <Pressable onPress={() => setStep('welcome')} hitSlop={8} style={styles.back} accessibilityRole="button">
            <IconSymbol name="chevron.left" size={22} color={theme.text} />
          </Pressable>
          <View style={styles.loginContent}>
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
            <ThemedText style={styles.headline}>Sign In</ThemedText>
            <ThemedText style={[styles.subhead, { color: theme.textSecondary }]}>
              Sign in as admin to manage mosque prayer times.
            </ThemedText>
            <View style={styles.loginForm}>
              <AdminLoginForm onSuccess={() => setStep('select')} />
            </View>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <FlatList
          data={mosques}
          keyExtractor={(mosque) => mosque.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText style={styles.headline2}>My Mosques</ThemedText>
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
        <View style={[styles.doneFooter, { borderTopColor: theme.border }]}>
          <Pressable
            onPress={finish}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.85 : 1 },
            ]}>
            <ThemedText style={styles.primaryButtonText}>Done</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  welcomeContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 40 },
  headline: { fontSize: 28, fontWeight: '600', textAlign: 'center', marginTop: 14 },
  subhead: { fontSize: 16, textAlign: 'center', lineHeight: 23 },
  welcomeFooter: { paddingHorizontal: 32, paddingBottom: 16, gap: 14 },
  back: { padding: 12, marginLeft: 8, marginTop: 4, minWidth: 44, minHeight: 44, alignItems: 'flex-start', justifyContent: 'center' },
  loginContent: { flex: 1, alignItems: 'center', paddingHorizontal: 32, paddingTop: 8 },
  logo: { width: 72, height: 72, borderRadius: 18, marginBottom: 18 },
  loginForm: { width: '100%', marginTop: 28 },
  primaryButton: { paddingVertical: 16, borderRadius: 100, alignItems: 'center', minHeight: 44 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  skip: { alignItems: 'center', paddingVertical: 8, minHeight: 44, justifyContent: 'center' },
  skipText: { fontSize: 14, fontWeight: '500' },
  list: { paddingHorizontal: 20, paddingBottom: 16 },
  header: { paddingTop: 12, paddingBottom: 20, gap: 6 },
  headline2: { fontSize: 26, fontWeight: '600' },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subtitle: { fontSize: 15, flexShrink: 1 },
  selectAll: { fontSize: 14, fontWeight: '600' },
  doneFooter: { paddingHorizontal: 32, paddingTop: 16, paddingBottom: 16, borderTopWidth: StyleSheet.hairlineWidth },
});
