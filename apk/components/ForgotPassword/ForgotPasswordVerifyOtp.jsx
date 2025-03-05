import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { OtpInput } from "react-native-otp-entry";
import axios from 'axios';
import { url_api } from '../../impUrl';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AntDesign } from '@expo/vector-icons';

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
    <ImageBackground source={require('./bgc.jpg')} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={30} color="#1F41B1" />
      </TouchableOpacity>

      <Text style={styles.headingText}>Check your email</Text>
      <View style={styles.content}>
        <Text style={styles.contentText}>
          We sent a reset link to your {email}. Enter the 4-digit code mentioned in the email.
        </Text>
      </View>

      <KeyboardAwareScrollView style={{flex:1}}
        contentContainerStyle={{flexGrow:1}}
        keyboardShouldPersistTaps="handled"
      >
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
      <View style={styles.passwordContainer}>
        <FontAwesome name="lock" size={24} coloer="black" style={styles.inputIcon}/>
      <TextInput
        style={styles.textInput}
        placeholder="New Password"
        secureTextEntry={!isPasswordVisible}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity 
            onPress={togglePasswordVisibility}
            >
            <AntDesign 
              name={isPasswordVisible ? "eyeo" : "eye"} 
              size={20} 
              color="black"
              />
      </TouchableOpacity>
      </View>
      <View style={styles.confirmPasswordContainer}>
        <FontAwesome name="lock" size={24} color="black" style={styles.inputIcon}/>
        <TextInput
          style={styles.textInput}
          placeholder="Confirm New Password"
          secureTextEntry={!isCPasswordVisible}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={toggleCPasswordVisibility}>
              <AntDesign 
                name={isCPasswordVisible ? "eyeo" : "eye"} 
                size={20} 
                color="black"
                />
        </TouchableOpacity>
        </View>
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
      </KeyboardAwareScrollView>
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
    width: width * 0.13,
    height: height * 0.06,
    backgroundColor: '#fff',
    borderRadius: "50%",
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
    backgroundColor: '#90CAF9',
  },
  disabledPinCodeContainer: {
    backgroundColor: '#d1d1d1',
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8, 
    height: height * 0.07,  
    backgroundColor: "#BED8FE",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 5, 
  },
  confirmPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8, 
    height: height * 0.07,  
    backgroundColor: "#BED8FE",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 5, 
    marginTop:20,
    marginBottom:20
  },
  inputIcon: {
    marginRight: 10, 
  },
  textInput: {
    flex: 1,
    fontSize: height * 0.02,  
    paddingVertical: 10,
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
