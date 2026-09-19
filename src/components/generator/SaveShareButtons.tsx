import { Asset, usePermissions } from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ViewShotRef } from '../../lib/types';

interface Props {
  viewShotRef: React.RefObject<ViewShotRef | null>;
  onSaved: (imageUri: string) => void;
}

export default function SaveShareButtons({ viewShotRef, onSaved }: Props) {
  const [permissionResponse, requestPermission] = usePermissions();
  const [saving, setSaving] = useState(false);

  async function captureImage(): Promise<string | null> {
    if (!viewShotRef.current?.capture) return null;
    const uri = await viewShotRef.current.capture();
    return uri;
  }

  async function handleSaveToPhotos() {
    if (!permissionResponse?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Permission needed',
          'Photo library access is required to save QR codes.'
        );
        return;
      }
    }

    setSaving(true);
    try {
      const uri = await captureImage();
      if (!uri) throw new Error('Capture failed');

      await Asset.create(uri);
      onSaved(uri);
      Alert.alert('Saved', 'QR code saved to your photos.');
    } catch (error) {
      Alert.alert('Error', 'Could not save the QR code. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleShare() {
    setSaving(true);
    try {
      const uri = await captureImage();
      if (!uri) throw new Error('Capture failed');

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share the QR code. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.actions}>
      <TouchableOpacity style={styles.button} onPress={handleSaveToPhotos} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save to Photos'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleShare} disabled={saving}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButton: { backgroundColor: '#6b7280' },
  buttonText: { color: '#fff', fontWeight: '600' },
});