import Ionicons from '@react-native-vector-icons/ionicons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme/ThemeContext';
import { IoniconName } from '../../lib/types';

interface SourceTypeOption {
  type: 'url' | 'wifi' | 'contact' | 'text';
  label: string;
  icon: IoniconName;
}

const SOURCE_TYPES: SourceTypeOption[] = [
  { type: 'url', label: 'URL / Link', icon: 'link-outline' },
  { type: 'wifi', label: 'Wi-Fi Network', icon: 'wifi-outline' },
  { type: 'contact', label: 'Contact', icon: 'person-outline' },
  { type: 'text', label: 'Plain Text', icon: 'document-text-outline' },
];

export default function GenerateScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <Text style={[styles.heading, { color: colors.text }]}>What do you want to encode?</Text>
      <View style={styles.grid}>
        {SOURCE_TYPES.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/generate/${option.type}`)}
          >
            <Ionicons name={option.icon} size={32} color={colors.primary} />
            <Text style={[styles.cardLabel, { color: colors.text }]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cardLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});