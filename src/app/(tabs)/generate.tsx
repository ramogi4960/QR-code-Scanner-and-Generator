import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function GenerateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Generate</Text>
      <Link href={"/generate/wifi"} style={styles.link}>
        Generate QR Code
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: '600' },
  link: { marginTop: 20, fontSize: 16, color: 'blue' },
});