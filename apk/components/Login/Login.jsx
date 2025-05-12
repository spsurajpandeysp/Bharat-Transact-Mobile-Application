import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image,Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from "axios";
import { url_api } from '../../impUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');
const url = url_api;
const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    if (loading) return; 

    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please fill in both phone number and password!");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if(!phoneRegex.test(phoneNumber)){
      Alert.alert("Error","Please Enter Valid 10-digit Phone Number")
      return;
    }
    // const passwordRegex=/^(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/-])(?=.*\d).{7}$/
    // if(!passwordRegex.test(password)){
    //   Alert.alert("Error","Password must be 7 characters long, contain at least one special character and number");
    //   return;
    // }

    setLoading(true); 
    axios.post(`${url}/api/auth/login`, { phoneNumber, password })
      .then(async (response) => {
        const jwt = response.data.token;
        if (jwt) {
          await AsyncStorage.setItem("jwt_token", jwt);
          navigation.navigate("Home");
        } else {
          Alert.alert("Error", "Invalid credentials or no token returned.");
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes("User not found")) {
            Alert.alert("Error", "User not found. Please check your phone number.");
          } else if (errorMessage.includes("Invalid credentials")) {
            Alert.alert("Error", "Invalid password. Please try again.");
          } else if (errorMessage.includes("Please verify your phone before logging in.")) {
            Alert.alert("Error", "Please verify your phone before logging in.");
            navigation.navigate("PhoneVerifyOtp", { phoneNumber, from: "LoginPage" });
          } else {
            Alert.alert("Error", errorMessage || "Login failed. Please try again later.");
          }
        } else {
          Alert.alert("Error", "Unable to connect to the server. Please try again later.");
        }
      })
      .finally(() => setLoading(false)); 
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#1F41B1' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.welcome}>Welcome Back</Text>
            <Text style={styles.subtitle}>Hello there, sign in to continue</Text>
            <View style={styles.illustrationWrapper}>
              <View style={styles.dots}>
                <View style={[styles.dot, { backgroundColor: '#22D3EE', left: 10, top: 10 }]} />
                <View style={[styles.dot, { backgroundColor: '#F59E42', left: 60, top: 60 }]} />
                <View style={[styles.dot, { backgroundColor: '#3B82F6', left: 120, top: 30 }]} />
                <View style={[styles.dot, { backgroundColor: '#F43F5E', left: 30, top: 100 }]} />
              </View>
              <View style={styles.circleBg}>
                <Image source={require('../../assets/lock.png')} style={{ width: 90, height: 90 }} resizeMode="contain" />
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={[styles.input, { marginBottom: 0, flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword((prev) => !prev)}
                activeOpacity={0.7}
              >
                <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Forgot your password ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signInBtn} onPress={handleLogin}>
              <Text style={styles.signInBtnText}>Sign in</Text>
            </TouchableOpacity>
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
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
  header: {
    width: '100%',
    height: height * 0.18,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 18,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
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
  signInHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#222',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    alignSelf: 'flex-start',
    marginBottom: 2,
    color:'#1F41B1'
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  illustrationWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  circleBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dots: {
    position: 'absolute',
    width: 180,
    height: 180,
    zIndex: 1,
  },
  dot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    opacity: 0.8,
  },
  input: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    fontSize: 16,
    color: '#222',
    marginBottom: 14,
  },
  passwordInputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    color: '#888',
    fontSize: 14,
  },
  signInBtn: {
    width: '100%',
    backgroundColor: '#1F41B1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  signInBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    color: '#222',
    fontSize: 15,
  },
  signupLink: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 2,
  },
});

export default Login;
