import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function GenerateTypeScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Generate form for: {type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: '600' },
});