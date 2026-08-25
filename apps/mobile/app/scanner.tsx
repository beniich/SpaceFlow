import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { COLORS } from '../src/utils/constants';
import { api } from '../src/services/api';

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, setPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      setPermission(status === 'granted');
    });
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const response = await api.get(`/api/assets/qr/${encodeURIComponent(data)}`);
      if (response.data?.workOrderId) {
        router.replace(`/work-order/${response.data.workOrderId}`);
      } else if (response.data?.id) {
        Alert.alert('Équipement identifié', `Nom: ${response.data.name}\nLocalisation: ${response.data.location || 'N/A'}`);
        router.back();
      } else {
        Alert.alert('QR Code scanné', `Contenu: ${data}`);
        router.back();
      }
    } catch (error) {
      Alert.alert('Équipement non trouvé', `QR Code: ${data}`);
      router.back();
    }
  };

  if (permission === null) return <View style={styles.container} />;

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Permission caméra refusée</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'code39'],
        }}
      />

      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instructions}>
          Scannez le QR code de l'équipement
        </Text>
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <X size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: COLORS.light.primary,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    marginTop: 32,
    textAlign: 'center',
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 24,
    padding: 12,
  },
  error: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
    marginTop: 100,
  },
  link: {
    color: COLORS.light.primary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});
