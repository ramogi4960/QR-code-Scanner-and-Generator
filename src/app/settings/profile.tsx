import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSettings, updateSettings } from '../../lib/settings/storage';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      setName(settings.displayName);
      setLoaded(true);
    });
  }, []);

  async function handleSave() {
    await updateSettings({ displayName: name });
  }

  if (!loaded) return <View style={styles.container} />;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.label}>Display Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
      />
      <Button title="Save" onPress={handleSave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, fontSize: 15 },
});