import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getSettings, ThemePreference, updateSettings } from '../settings/storage';
import { darkColors, lightColors, ThemeColors } from './colors';

interface ThemeContextValue {
  colors: ThemeColors;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null, tracks OS setting live
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      setPreferenceState(settings.theme);
      setLoaded(true);
    });
  }, []);

  function setPreference(pref: ThemePreference) {
    setPreferenceState(pref);
    updateSettings({ theme: pref });
  }

  const isDark = preference === 'system' ? systemScheme === 'dark' : preference === 'dark';
  const colors = isDark ? darkColors : lightColors;

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ colors, preference, setPreference, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}