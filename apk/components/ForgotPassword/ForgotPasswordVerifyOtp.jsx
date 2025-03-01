import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { OtpInput } from "react-native-otp-entry";
import axios from 'axios';
import { url_api } from '../../impUrl';

const { width, height } = Dimensions.get("window");
const url = url_api;

export default function FpVo({ navigation, route }) {
  const { email } = route.params;  
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  
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

  return (
    <ImageBackground source={require('./bgc.jpg')} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={30} color="#1F41B1" />
      </TouchableOpacity>

      <Text style={styles.headingText}>Check your email</Text>
      <View style={styles.content}>
        <Text style={styles.contentText}>
          We sent a reset link to your email. Enter the 4-digit code mentioned in the email.
        </Text>
      </View>

      <OtpInput
        numberOfDigits={4}
        focusColor="blue"
        autoFocus={false}
        hideStick={true}
        placeholder="*"
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onTextChange={setOtp}
        onFilled={(text) => console.log(`OTP entered: ${text}`)}
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
      <TextInput
        style={styles.textInput}
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <View style={styles.verifyBtn}>
          <Text style={styles.verifyBtnText}>
            {loading ? <ActivityIndicator size="small" color="white" /> : "Verify Code"}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.reSendContainer}>
        <Text style={styles.resend}>Haven't got the email yet? </Text>
        <TouchableOpacity onPress={handleResendCode} disabled={resending}>
          <Text style={styles.resendText}>
            {resending ? "Resending..." : "Resend Email"}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.18,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.09,
    left: 20,
    zIndex: 1,
  },
  headingText: {
    color: "#1F41B1",
    fontSize: height * 0.08,
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
  textInput: {
    width: width * 0.8,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    fontSize: height * 0.02,
    marginVertical: 10,
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
  verifyBtnText: {
    fontSize: height * 0.025,
    color: 'white',
    fontWeight: "700",
  },
  reSendContainer: {
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
