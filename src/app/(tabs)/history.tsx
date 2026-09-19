import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryFilterBar, { HistoryFilter } from '../../components/history/HistoryFilterBar';
import HistoryListItem from '../../components/history/HistoryListItem';
import { getAllHistory, getHistoryByType, HistoryRecord } from '../../lib/db/queries';

export default function HistoryScreen() {
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  const loadRecords = useCallback(() => {
    const data = filter === 'all' ? getAllHistory() : getHistoryByType(filter);
    setRecords(data);
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HistoryFilterBar active={filter} onChange={setFilter} />
      {records.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No history yet</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <HistoryListItem record={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 20 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#9ca3af', fontSize: 15 },
});