import * as Clipboard from 'expo-clipboard';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { deleteHistory, getHistoryById, HistoryRecord } from '../../lib/db/queries';
import { useTheme } from '../../lib/theme/ThemeContext';

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [record, setRecord] = useState<HistoryRecord | null>(null);

  useFocusEffect(
    useCallback(() => {
      const numericId = Number(id);
      const result = getHistoryById(numericId);
      setRecord(result);
    }, [id])
  );

  if (!record) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFound, { color: colors.textMuted }]}>Record not found</Text>
      </View>
    );
  }

  const currentRecord = record;

  async function handleCopy() {
    await Clipboard.setStringAsync(currentRecord.content);
  }

  async function handleShare() {
    if (currentRecord.image_uri) {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(currentRecord.image_uri);
      }
    }
  }

  function handleDelete() {
    Alert.alert(
      'Delete this record?',
      'This only removes it from your history — any saved photo stays in your camera roll.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteHistory(currentRecord.id);
            router.back();
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      {currentRecord.image_uri && (
        <Image source={{ uri: currentRecord.image_uri }} style={[styles.image, { backgroundColor: colors.surface }]} />
      )}

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {currentRecord.action_type === 'scanned' ? 'Scanned' : 'Generated'}
          {currentRecord.source_type ? ` · ${currentRecord.source_type}` : ''}
        </Text>
        <Text style={[styles.content, { color: colors.text }]}>{currentRecord.content}</Text>
        <Text style={[styles.timestamp, { color: colors.textMuted }]}>
          {new Date(currentRecord.created_at).toLocaleString()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface }]} onPress={handleCopy}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Copy</Text>
        </TouchableOpacity>

        {currentRecord.image_uri && (
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.surface }]} onPress={handleShare}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Share</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.destructiveSurface }]} onPress={handleDelete}>
          <Text style={[styles.buttonText, { color: colors.destructive }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 20 },
  notFound: { textAlign: 'center', marginTop: 40 },
  image: { width: '100%', aspectRatio: 1, borderRadius: 16 },
  section: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  content: { fontSize: 17, lineHeight: 24 },
  timestamp: { fontSize: 13 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  button: { flex: 1, minWidth: 100, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  buttonText: { fontWeight: '600' },
});