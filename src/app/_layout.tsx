import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDatabase } from '../lib/db/schema';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initDatabase();
    setIsDbReady(true);
  }, []);

  useEffect(() => {
    if (isDbReady) {
      SplashScreen.hideAsync();
    }
  }, [isDbReady]);

  if (!isDbReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="generate/[type]" options={{ title: 'Generate' }} />
        <Stack.Screen name="history/[id]" options={{ title: 'Details' }} />
        <Stack.Screen name="settings/profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="settings/appearance" options={{ title: 'Appearance' }} />
      </Stack>
    </SafeAreaProvider>
  );
}