import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert, KeyboardAvoidingView, Platform,ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { OtpInput } from "react-native-otp-entry";
import axios from "axios";
import { url_api } from '../../impUrl';

const { width, height } = Dimensions.get("window");
const url = url_api;

const PhoneVerifyOtp = ({ route, navigation }) => {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const phoneNumber = route.params?.phoneNumber;
  const prevPath = route.params?.from;

  const validateOtp = () => {
    const otpRegex = /^\d{4}$/; 
    return otpRegex.test(otp);
  };

  const submitHandle = async () => {
    if (!validateOtp()) {
      Alert.alert("Validation Error", "Please enter a valid 4-digit OTP.");
      return;
    }

    setIsSubmitting(true);

    axios.post(`${url}/api/auth/phone-verify`, { phoneNumber, otp })
      .then((response) => {
          Alert.alert("Success", "Phone number verified successfully!");
          navigation.replace("MpinCreate");
      })
      .catch((error) => {
        Alert.alert("Error", error.response?.data?.message || "An error occurred during OTP verification.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (prevPath === "LoginPage") {
      resendHandle();
    }
  }, []);

  const resendHandle = () => {
    setIsResending(true);

    axios.post(`${url}/auth/api/resend-phone-verify-otp`, { phoneNumber })
      .then((response) => {
          Alert.alert("Message", "OTP resent successfully!");
      })
      .catch((error) => {
        Alert.alert("Error", error.response?.data?.message || "An error occurred while resending OTP.");
      })
      .finally(() => {
        setIsResending(false);
      });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={26} color="#1F41B1" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.headingText}>Check your phone</Text>
        <Text style={styles.subtitle}>We sent a verification code to {phoneNumber}. Enter the 4-digit code mentioned in the SMS.</Text>
        
        <OtpInput
          numberOfDigits={4}
          focusColor="#1F41B1"
          autoFocus={true}
          hideStick={true}
          placeholder="*"
          blurOnFilled={true}
          disabled={false}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onTextChange={(text) => setOtp(text)}
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

        <TouchableOpacity onPress={submitHandle} style={styles.verifyBtn} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify Code</Text>
          )}
        </TouchableOpacity>

        <View style={styles.reSendContainer}>
          <Text style={styles.resend}>Haven't received the SMS yet? </Text>
          <TouchableOpacity onPress={resendHandle} disabled={isResending}>
            <Text style={styles.resendText}>
              {isResending ? "Resending..." : "Resend SMS"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

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

export default PhoneVerifyOtp;
