import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Props {
  value: string;
}

export default function QRPreview({ value }: Props) {
  return (
    <View style={styles.container}>
      <QRCode value={value} size={220} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
});