// components/scanner/ScanResultSheet.tsx
import * as Clipboard from 'expo-clipboard';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScannedContentType } from '../../lib/qr/detectType';

interface Props {
  data: string;
  type: ScannedContentType;
  onSaveAndClose: () => void;
  onScanAgain: () => void;
}

export default function ScanResultSheet({ data, type, onSaveAndClose, onScanAgain }: Props) {
  async function handleCopy() {
    await Clipboard.setStringAsync(data);
  }

  async function handleOpenLink() {
    const canOpen = await Linking.canOpenURL(data);
    if (canOpen) {
      Linking.openURL(data);
    }
  }

  return (
    <View style={styles.sheet}>
      <Text style={styles.label}>{typeLabel(type)}</Text>
      <Text style={styles.content} numberOfLines={3}>{data}</Text>

      <View style={styles.actions}>
        {type === 'url' && (
          <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
            <Text style={styles.buttonText}>Open Link</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleCopy}>
          <Text style={styles.buttonText}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onSaveAndClose}>
          <Text style={[styles.buttonText, styles.primaryButtonText]}>Save & Close</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onScanAgain}>
        <Text style={styles.scanAgain}>Scan Again</Text>
      </TouchableOpacity>
    </View>
  );
}

function typeLabel(type: ScannedContentType): string {
  switch (type) {
    case 'url': return 'Link';
    case 'wifi': return 'Wi-Fi Network';
    case 'contact': return 'Contact';
    default: return 'Text';
  }
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  label: { color: '#9ca3af', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  content: { color: '#fff', fontSize: 16 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  primaryButton: { backgroundColor: '#2563eb' },
  buttonText: { color: '#fff', fontWeight: '600' },
  primaryButtonText: { color: '#fff' },
  scanAgain: { color: '#9ca3af', textAlign: 'center', fontSize: 14, marginTop: 4 },
});