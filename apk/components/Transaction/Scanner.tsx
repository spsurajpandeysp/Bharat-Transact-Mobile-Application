import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

export default function Scanner({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanResult, setScanResult] = useState(null);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      Alert.alert(
        "Camera Permission Required",
        "This app needs camera access to scan QR codes. Please grant permission.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: requestPermission }
        ]
      );
    }
  }, [permission]);

  function toggleTorch() {
    setTorch(prevState => !prevState);
  }

  function handleScan({ type, data }) {
    if (!scanned) {
      setScanned(true);
      setScanResult(data);
      console.log(data);
      navigation.navigate('ScannedSendMoney', {
        scannedData: data
      });
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1E40AF']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Scan & Pay</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cameraBox}>
            <CameraView
              style={styles.scanner}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleScan}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              enableTorch={torch}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.torchButton} 
              onPress={toggleTorch}
            >
              <MaterialIcons 
                name={torch ? "flashlight-on" : "flashlight-off"} 
                size={24} 
                color="#2563EB" 
              />
              <Text style={styles.torchButtonText}>
                {torch ? "Turn Off Flash" : "Turn On Flash"}
              </Text>
            </TouchableOpacity>

            {scanned && (
              <TouchableOpacity 
                style={styles.scanAgainButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: height * 0.05,
    paddingHorizontal: 20,
    paddingBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '90%',
    alignItems: 'center',
  },
  cameraBox: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: '#2563EB',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
  },
  scanner: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
  },
  torchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  torchButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  scanAgainButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  scanAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});