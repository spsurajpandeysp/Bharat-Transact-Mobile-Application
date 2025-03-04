import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome } from '@expo/vector-icons';
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
      Alert.alert("Scanned QR Code", `The scanned qr code data is: ${data}`);
      console.log(data);
    }
  }

  return (
    <ImageBackground source={require("./bgc.jpg")} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={30} color="#1F41B1" />
      </TouchableOpacity>
      <Text style={styles.headingText}>Scan And Pay</Text>
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
      <TouchableOpacity onPress={toggleTorch}>
        <MaterialIcons name={torch ? "flashlight-on" : "flashlight-off"} size={28} color="black" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setScanned(false)}>
        <Text style={styles.button}>Scan again</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: height * 0.15,
  },
  headingText: {
    color: "#1F41B1",
    fontSize: height * 0.08,
    fontWeight: "900",
    textAlign: 'center',
  },
  cameraBox: {
    width: 300,
    height: 300,
    borderWidth: 5,
    borderColor: 'blue',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: height * 0.05,
    marginBottom: height * 0.04,
  },
  scanner: {
    width: '100%',
    height: '100%',
  },
  button: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#1F41B1',
    borderRadius: 6,
    marginTop: 10,
    fontSize: height * 0.025,
    paddingVertical: 12,
    paddingHorizontal: 50,
    fontWeight: '700',
  },
  message: {
    color: '#1F41B1',
    textAlign: 'center',
    marginTop: height * 0.2,
    marginBottom: height * 0.04,
    fontSize: 28,
    fontWeight: '500',
  },
  permissionButton: {
    paddingVertical: 12,
    backgroundColor: '#1f41b1',
    borderRadius: 5,
    width: width * 0.7, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
    alignSelf: 'center', 
  },
  permissionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  scanResultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    backgroundColor: '#121212',
  },
  scanResultText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: '#F06292',
    borderRadius: 10,
  },
  icon: {
    marginBottom: height * 0.02,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.09,
    left: 20,
    zIndex: 1,
  },
});
