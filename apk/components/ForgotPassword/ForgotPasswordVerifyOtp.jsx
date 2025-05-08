import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import axios from 'axios';
import { url_api } from '../../impUrl';
import { FontAwesome } from '@expo/vector-icons';
const { width, height } = Dimensions.get("window");
const url = url_api;

export default function FpVo({ navigation, route }) {
  const { email } = route.params;  
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isPasswordVisible,setPasswordVisible]=useState(false);
  const [isCPasswordVisible,setCPasswordVisible]=useState(false);
  const handleSubmit = async () => {
    if (!otp || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${url}/auth/api/reset-password`, {
        email,
        otp,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });
      if (response.status === 200) {
        Alert.alert("Success", response.data.message || "Password reset successfully!");
        navigation.navigate("Login");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleResendCode = async () => {
    setResending(true);
    try {
      const response = await axios.post(`${url}/auth/api/forget-password`, { email });
      if (response.status === 200) {
        Alert.alert("Success", response.data.message || "OTP resent successfully!");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };
  const togglePasswordVisibility=()=>{
    setPasswordVisible(prevState=>!prevState);
  };
  const toggleCPasswordVisibility=()=>{
    setCPasswordVisible(prevState=>!prevState);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={26} color="#1F41B1" />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.headingText}>Check your email</Text>
        <Text style={styles.subtitle}>We sent a reset link to your {email}. Enter the 4-digit code mentioned in the email.</Text>
        <OtpInput
          numberOfDigits={4}
          focusColor="#1F41B1"
          autoFocus={false}
          hideStick={true}
          placeholder="*"
          blurOnFilled={true}
          disabled={false}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onTextChange={setOtp}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.otpBox,
            pinCodeTextStyle: styles.otpDigit,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.otpBoxActive,
            placeholderTextStyle: styles.placeholderText,
            filledPinCodeContainerStyle: styles.otpBoxFilled,
            disabledPinCodeContainerStyle: styles.otpBoxDisabled,
          }}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="New Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <FontAwesome name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm New Password"
            secureTextEntry={!isCPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={toggleCPasswordVisibility} style={styles.eyeIcon}>
            <FontAwesome name={isCPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.verifyBtn} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify Code</Text>
          )}
        </TouchableOpacity>
        <View style={styles.reSendContainer}>
          <Text style={styles.resend}>Haven't got the email yet? </Text>
          <TouchableOpacity onPress={handleResendCode} disabled={resending}>
            <Text style={styles.resendText}>{resending ? "Resending..." : "Resend Email"}</Text>
          </TouchableOpacity>
        </View>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  otpBox: {
    width: 48,
    height: 56,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  otpBoxActive: {
    borderColor: '#1F41B1',
    borderWidth: 2,
  },
  otpBoxFilled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#1F41B1',
  },
  otpBoxDisabled: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E2E8F0',
  },
  otpDigit: {
    fontSize: 24,
    color: '#222',
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: '#222',
    backgroundColor: 'transparent',
  },
  verifyBtn: {
    width: '100%',
    backgroundColor: '#1F41B1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  verifyBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  reSendContainer: {
    paddingTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  resend: {
    fontSize: 15,
    color: '#000',
  },
  resendText: {
    color: '#1F41B1',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 2,
  },
});
