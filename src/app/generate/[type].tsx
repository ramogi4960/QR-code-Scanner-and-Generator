import SaveShareButtons from '@/components/generator/SaveShareButtons';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import QRPreview from '../../components/generator/QRPreview';
import { insertHistory } from '../../lib/db/queries';
import {
  buildContactPayload,
  buildTextPayload,
  buildUrlPayload,
  buildWifiPayload,
  ContactFields,
  isContactValid,
  isTextValid,
  isUrlValid,
  isWifiValid, WifiFields,
} from '../../lib/qr/generator';
import { ViewShotRef } from '../../lib/types';

type GenerateType = 'url' | 'wifi' | 'contact' | 'text';

export default function GenerateTypeScreen() {
  const { type } = useLocalSearchParams<{ type: GenerateType }>();
  const viewShotRef = useRef<ViewShotRef | null>(null);

  function handleSaved(imageUri: string) {
    insertHistory('generated', payload, type, imageUri);
  }

  // Separate state per type — simplest to reason about, no shared-shape juggling
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [wifi, setWifi] = useState<WifiFields>({ ssid: '', password: '', security: 'WPA' });
  const [contact, setContact] = useState<ContactFields>({ name: '', phone: '', email: '' });

  const { payload, isValid } = getPayloadAndValidity(type, { text, url, wifi, contact });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {type === 'text' && (
        <View style={styles.field}>
          <Text style={styles.label}>Text</Text>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Enter any text"
            multiline
          />
        </View>
      )}

      {type === 'url' && (
        <View style={styles.field}>
          <Text style={styles.label}>URL</Text>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="example.com"
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>
      )}

      {type === 'wifi' && (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Network Name (SSID)</Text>
            <TextInput
              style={styles.input}
              value={wifi.ssid}
              onChangeText={(v) => setWifi({ ...wifi, ssid: v })}
              placeholder="MyWiFiNetwork"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={wifi.password}
              onChangeText={(v) => setWifi({ ...wifi, password: v })}
              placeholder="Leave blank if open network"
              secureTextEntry
            />
          </View>
        </>
      )}

      {type === 'contact' && (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={contact.name}
              onChangeText={(v) => setContact({ ...contact, name: v })}
              placeholder="Jane Doe"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={contact.phone}
              onChangeText={(v) => setContact({ ...contact, phone: v })}
              placeholder="+254 700 000000"
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={contact.email}
              onChangeText={(v) => setContact({ ...contact, email: v })}
              placeholder="jane@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </>
      )}

      <View style={styles.previewSlot}>
        {isValid ? (
          <>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
              <QRPreview value={payload} />
            </ViewShot>
            <SaveShareButtons viewShotRef={viewShotRef} onSaved={handleSaved} />
          </>
        ) : (
          <Text style={styles.placeholder}>Fill in the required fields to see your QR code</Text>
        )}
      </View>
    </ScrollView>
  );
}

function getPayloadAndValidity(
  type: GenerateType | undefined,
  values: { text: string; url: string; wifi: WifiFields; contact: ContactFields }
): { payload: string; isValid: boolean } {
  switch (type) {
    case 'text':
      return { payload: buildTextPayload(values.text), isValid: isTextValid(values.text) };
    case 'url':
      return { payload: buildUrlPayload(values.url), isValid: isUrlValid(values.url) };
    case 'wifi':
      return { payload: buildWifiPayload(values.wifi), isValid: isWifiValid(values.wifi) };
    case 'contact':
      return { payload: buildContactPayload(values.contact), isValid: isContactValid(values.contact) };
    default:
      return { payload: '', isValid: false };
  }
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  previewSlot: { marginTop: 20, alignItems: 'center', minHeight: 260, justifyContent: 'center' },
  placeholder: { color: '#9ca3af', textAlign: 'center', paddingHorizontal: 20 },
});