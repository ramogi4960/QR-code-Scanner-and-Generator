import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  return (
    <View style={styles.bar}>
      {FILTERS.map((f) => (
        <TouchableOpacity
          key={f.key}
          style={[styles.tab, active === f.key && styles.tabActive]}
          onPress={() => onChange(f.key)}
        >
          <Text style={[styles.label, active === f.key && styles.labelActive]}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f3f4f6' },
  tabActive: { backgroundColor: '#2563eb' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  labelActive: { color: '#fff' },
});