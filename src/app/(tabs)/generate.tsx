import Ionicons from '@react-native-vector-icons/ionicons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>What do you want to encode?</Text>
      <View style={styles.grid}>
        {SOURCE_TYPES.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={styles.card}
            onPress={() => router.push(`/generate/${option.type}`)}
          >
            <Ionicons name={option.icon} size={32} color="#2563eb" />
            <Text style={styles.cardLabel}>{option.label}</Text>
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
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  cardLabel: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});