// // import { useState } from 'react';
// import { useCameraPermissions } from 'expo-camera';
// import { Button, Linking, StyleSheet, Text, View } from 'react-native';

// export default function ScanScreen() {
//   const [permission, requestPermission] = useCameraPermissions();

//   // State 1: permission info still loading
//   if (!permission) {
//     return <View style={styles.container} />;
//   }

//   // State 2: not yet asked, OR previously denied but can still ask again
//   if (!permission.granted && permission.canAskAgain) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Camera access needed</Text>
//         <Text style={styles.message}>
//           We use your camera to scan QR codes. Nothing is recorded or sent
//           anywhere — scanning happens entirely on your device.
//         </Text>
//         <Button title="Grant Camera Access" onPress={requestPermission} />
//       </View>
//     );
//   }

//   // State 3: permanently denied — device settings must be used
//   if (!permission.granted && !permission.canAskAgain) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Camera access denied</Text>
//         <Text style={styles.message}>
//           Camera access was denied. Enable it in your device settings to scan
//           QR codes.
//         </Text>
//         <Button title="Open Settings" onPress={() => Linking.openSettings()} />
//       </View>
//     );
//   }

//   // State 4: granted — placeholder until CameraView is wired in next
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Camera permission granted ✅</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//   },
//   title: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
//   message: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
//   text: { fontSize: 18, fontWeight: '600' },
// });

import { useCameraPermissions } from 'expo-camera';
import { useEffect, useState } from 'react';
import { AppState, Button, Linking, StyleSheet, Text, View } from 'react-native';
import QRCameraView from '../../components/scanner/CameraView';
import ScanResultSheet from '../../components/scanner/ScanResultScreen';
import { insertHistory } from '../../lib/db/queries';
import { detectContentType, ScannedContentType } from '../../lib/qr/detectType';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<{ data: string; type: ScannedContentType } | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        requestPermission();
      }
    });
    return () => subscription.remove();
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted && permission.canAskAgain) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.message}>
          We use your camera to scan QR codes. Nothing is recorded or sent
          anywhere — scanning happens entirely on your device.
        </Text>
        <Button title="Grant Camera Access" onPress={requestPermission} />
      </View>
    );
  }

  if (!permission.granted && !permission.canAskAgain) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera access denied</Text>
        <Text style={styles.message}>
          Camera access was denied. Enable it in your device settings to scan
          QR codes.
        </Text>
        <Button title="Open Settings" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  function handleScanned(data: string) {
    const type = detectContentType(data);
    setResult({ data, type });
  }

  function handleSaveAndClose() {
    if (!result) return;
    insertHistory('scanned', result.data, result.type, undefined);
    setResult(null);
  }

  
  function handleScanAgain() {
    setResult(null);
  }

  return (
    <View style={styles.cameraContainer}>
      <QRCameraView onScanned={handleScanned} paused={result !== null} />
      {result && (
        <ScanResultSheet
          data={result.data}
          type={result.type}
          onSaveAndClose={handleSaveAndClose}
          onScanAgain={handleScanAgain}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  cameraContainer: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
});