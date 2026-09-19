import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemePreference } from '../../lib/settings/storage';
import { useTheme } from '../../lib/theme/ThemeContext';

const OPTIONS: { key: ThemePreference; label: string }[] = [
  { key: 'system', label: 'System Default' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

export default function AppearanceScreen() {
  const { preference, setPreference, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.option,
            { backgroundColor: preference === option.key ? colors.primary : colors.surface },
          ]}
          onPress={() => setPreference(option.key)}
        >
          <Text
            style={[
              styles.optionLabel,
              { color: preference === option.key ? '#fff' : colors.text },
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10 },
  option: { padding: 16, borderRadius: 10 },
  optionLabel: { fontSize: 15, fontWeight: '500' },
});