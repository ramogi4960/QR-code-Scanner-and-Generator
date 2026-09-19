import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../lib/theme/ThemeContext';

export type HistoryFilter = 'all' | 'scanned' | 'generated';

interface Props {
  active: HistoryFilter;
  onChange: (filter: HistoryFilter) => void;
}

const FILTERS: { key: HistoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'scanned', label: 'Scanned' },
  { key: 'generated', label: 'Generated' },
];

export default function HistoryFilterBar({ active, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.bar}>
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.key}
          style={[
            styles.tab,
            { backgroundColor: active === f.key ? colors.primary : colors.surface },
          ]}
          onPress={() => onChange(f.key)}
        >
          <Text
            style={[
              styles.label,
              { color: active === f.key ? '#fff' : colors.text },
            ]}
          >
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  label: { fontSize: 14, fontWeight: '600' },
});