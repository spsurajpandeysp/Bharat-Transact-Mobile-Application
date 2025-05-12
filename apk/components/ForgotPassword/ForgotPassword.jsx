import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
const { width, height } = Dimensions.get("window");
import { url_api } from '../../impUrl'; 
import axios from 'axios';
const url = url_api;

export default function ForgotPassword({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/auth/forget-password`, { phoneNumber });

      if (response.status === 200) {
        navigation.navigate("ForgetPasswordVerifyOtp", { phoneNumber });  
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.status === 404) {
        Alert.alert("Error", "Account not found. Please check your phone number.");
      } else {
        Alert.alert("Error", error.response?.data?.message || "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={26} color="#1F41B1" />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.headingText}>Forgot Password</Text>
        <Text style={styles.subtitle}>Please enter your phone number to reset the password</Text>
        <View style={styles.inputs}>
          <TextInput
            placeholder='Phone Number'
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
        <TouchableOpacity onPress={handleNext} disabled={loading} style={styles.ResetButton}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.btnText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F41B1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  headingText: {
    color: '#1F41B1',
    fontSize: 26,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  inputs: {
    width: '100%',
    marginBottom: 18,
  },
  textInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    fontSize: 16,
    color: '#222',
    marginBottom: 0,
  },
  ResetButton: {
    width: '100%',
    backgroundColor: '#1F41B1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
