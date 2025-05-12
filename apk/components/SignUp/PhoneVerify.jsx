import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { OtpInput } from "react-native-otp-entry";
import { Button } from "react-native-paper";
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
    <ImageBackground source={require('./bgc2.jpg')} style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={30} color="#1F41B1" />
      </TouchableOpacity>

      <Text style={styles.headingText}>Enter Your Verification Code</Text>

      <View style={styles.content}>
        <Text style={styles.contentText}>
          We sent a verification code to your phone number. Enter the 4-digit code mentioned in the SMS.
        </Text>
      </View>

      <OtpInput
        numberOfDigits={4}
        onTextChange={(text) => setOtp(text)}
        focusColor="blue"
        autoFocus={false}
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
          pinCodeTextStyle: styles.pinCodeText,
          focusStickStyle: styles.focusStick,
          focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          placeholderTextStyle: styles.placeholderText,
          filledPinCodeContainerStyle: styles.filledPinCodeContainer,
          disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
        }}
      />

      <Button
        mode="contained"
        style={styles.verifyBtn}
        onPress={submitHandle}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Verifying..." : "Verify Code"}
      </Button>

      <View style={styles.reSendContainer}>
        <Text style={styles.resend}>Haven't received the SMS yet?</Text>
        <TouchableOpacity onPress={resendHandle} disabled={isResending}>
          <Text style={styles.resendText}>
            {isResending ? "Resending..." : "Resend SMS"}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.13,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.09,
    left: 20,
    zIndex: 1,
  },
  headingText: {
    color: "#1F41B1",
    fontSize: height * 0.07,
    fontWeight: "900",
  },
  content: {
    paddingTop: 20,
    alignItems: 'center',
  },
  contentText: {
    fontSize: height * 0.02,
    fontWeight: "800",
    width: width * 0.7,
    textAlign: 'center',
  },
  otpContainer: {
    paddingTop: height * 0.04,
    width: width * 0.8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  pinCodeContainer: {
    width: width * 0.15,
    height: height * 0.06,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  pinCodeText: {
    fontSize: height * 0.04,
    color: '#000',
  },
  focusStick: {
    height: 4,
    backgroundColor: 'blue',
  },
  activePinCodeContainer: {
    borderColor: 'blue',
    borderWidth: 2,
  },
  placeholderText: {
    fontSize: height * 0.04,
    color: '#b0b0b0',
  },
  filledPinCodeContainer: {
    backgroundColor: '#d1f0e3',
  },
  disabledPinCodeContainer: {
    backgroundColor: '#d1d1d1',
  },
  verifyBtn: {
    backgroundColor: '#1F41BB',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 50,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: "#1F41BB",
    fontWeight: '600',
    fontSize: height * 0.022,
  },
});

export default PhoneVerifyOtp;
