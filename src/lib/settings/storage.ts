import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface AppSettings {
  displayName: string;
  theme: ThemePreference;
}

const STORAGE_KEY = 'app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  displayName: '',
  theme: 'system',
};

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated = { ...current, ...partial };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}