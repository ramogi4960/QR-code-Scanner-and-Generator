// import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
// import { useState } from 'react';
// import { Button, Linking, StyleSheet, Text, View } from 'react-native';

// export default function ScanScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanned, setScanned] = useState(false);
//   const [lastResult, setLastResult] = useState<string | null>(null);

//   if (!permission) {
//     return <View style={styles.container} />;
//   }

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

//   function handleBarcodeScanned(result: BarcodeScanningResult) {
//     if (scanned) return; // ignore repeat callbacks while a code is still in frame

//     setScanned(true);
//     setLastResult(result.data);
//     console.log('Scanned:', result.data);
//   }

//   function resetScanner() {
//     setScanned(false);
//     setLastResult(null);
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={StyleSheet.absoluteFill}
//         facing="back"
//         barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
//         onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
//       />

//       {scanned && (
//         <View style={styles.overlay}>
//           <Text style={styles.overlayText} numberOfLines={3}>
//             {lastResult}
//           </Text>
//           <Button title="Scan Again" onPress={resetScanner} />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   title: { fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
//   message: { fontSize: 15, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
//   overlay: {
//     position: 'absolute',
//     bottom: 40,
//     left: 20,
//     right: 20,
//     backgroundColor: 'rgba(0,0,0,0.85)',
//     borderRadius: 12,
//     padding: 16,
//     alignItems: 'center',
//     gap: 12,
//   },
//   overlayText: { color: '#fff', fontSize: 15, textAlign: 'center' },
// });

import { BarcodeScanningResult, CameraView as ExpoCameraView } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

interface Props {
  onScanned: (data: string) => void;
  paused: boolean;
}

export default function QRCameraView({ onScanned, paused }: Props) {
  const [scanned, setScanned] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  function handleBarcodeScanned(result: BarcodeScanningResult) {
    if (scanned) return;
    setScanned(true);
    setLastResult(result.data);
    onScanned(result.data);
  }

  function resetScanner() {
    setScanned(false);
    setLastResult(null);
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={paused ? undefined : handleBarcodeScanned}
      />
      {scanned && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText} numberOfLines={3}>{lastResult}</Text>
          <Button title="Scan Again" onPress={resetScanner} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute', bottom: 40, left: 20, right: 20,
    backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: 12,
    padding: 16, alignItems: 'center', gap: 12,
  },
  overlayText: { color: '#fff', fontSize: 15, textAlign: 'center' },
});