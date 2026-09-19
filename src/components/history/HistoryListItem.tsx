import Ionicons from '@react-native-vector-icons/ionicons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HistoryRecord } from '../../lib/db/queries';
import { useTheme } from '../../lib/theme/ThemeContext';

interface Props {
  record: HistoryRecord;
}

export default function HistoryListItem({ record }: Props) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => router.push(`/history/${record.id}`)}
    >
      {record.image_uri ? (
        <Image source={{ uri: record.image_uri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.surface }]}>
          <Ionicons
            name={record.action_type === 'scanned' ? 'scan-outline' : 'qr-code-outline'}
            size={22}
            color={colors.textSecondary}
          />
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.content, { color: colors.text }]} numberOfLines={1}>
          {record.content}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {record.action_type === 'scanned' ? 'Scanned' : 'Generated'}
          {record.source_type ? ` · ${record.source_type}` : ''}
          {' · '}{formatRelativeTime(record.created_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  thumbnail: { width: 48, height: 48, borderRadius: 8 },
  thumbnailPlaceholder: {
    width: 48, height: 48, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  info: { flex: 1, gap: 2 },
  content: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 13 },
});