import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert,KeyboardAvoidingView,Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { OtpInput } from "react-native-otp-entry";
import { Button } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
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
          navigation.replace("Login");
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
    <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1E40AF']}
        style={styles.header}
      >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Verify OTP</Text>
      </LinearGradient>
    <View style={styles.content}>
    <View style={styles.otpSection}>
        <Text style={styles.contentTitle}>
          Enter Your Verification Code
        </Text>
        <Text style={styles.contentText}>
          We sent a verification code to your phone number. Enter the 4-digit code mentioned in the SMS.
        </Text>
      <OtpInput
        numberOfDigits={4}
        onTextChange={(text) => setOtp(text)}
        focusColor="#2563EB"
        autoFocus={true}
        hideStick={true}
        placeholder="*"
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onFilled={submitHandle}
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle: styles.pinCodeContainer,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          filledPinCodeContainerStyle: styles.filledPinCodeContainer,
          disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
        }}
      />
      <View style={styles.reSendContainer}>
        <Text style={styles.resend}>Haven't received the SMS yet?</Text>
        <TouchableOpacity onPress={resendHandle} disabled={isResending}>
          <Text style={styles.resendText}>
            {isResending ? "Resending..." : "Resend SMS"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
      <TouchableOpacity onPress={submitHandle} style={styles.verifyBtn}>
        <Text style={styles.verifyBtnText}>{isSubmitting ? "Verifying..." : "Verify Code"}</Text>
      </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#f8fafc',
  },
  content: {
        flex: 1,
        padding: 20,
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
    width: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
  },
  contentText: {
    fontSize: height * 0.018,
    fontWeight: "800",
    width: width * 0.7,
    textAlign: 'center',
    color: '#64748B',
  },
  contentTitle: {
    fontSize: height * 0.02,
    fontWeight: "800",
    width: width * 0.7,
    textAlign: 'center',
    color: '#2563EB',
    marginBottom: 40
  },
  otpContainer: {
    paddingTop: height * 0.02,
    width: width * 0.7,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pinCodeContainer: {
      width: width * 0.12,
      height: height * 0.06,
      backgroundColor: '#fff',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      elevation: 2,
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
  focusStick: {
      height: 4,
      backgroundColor: '#2563EB',
  },
  activePinCodeContainer: {
      borderColor: '#2563EB',
      borderWidth: 2,
  },
  filledPinCodeContainer: {
      backgroundColor: '#F8FAFC',
      borderColor: '#2563EB',
  },
  disabledPinCodeContainer: {
      backgroundColor: '#F1F5F9',
  },
  verifyBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    paddingTop: height * 0.02,
    alignItems: 'center',
    width: width * 0.8,
  },
  resend: {
    fontSize: height * 0.02,
    color: '#000',
  },
  resendText: {
    color: "#2563EB",
    fontWeight: '600',
    fontSize: height * 0.015,
  },
  otpSection:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
  }
});

export default PhoneVerifyOtp;
