import { 
  StyleSheet, Alert, Text, View, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Dimensions,SafeAreaView,StatusBar, ScrollView
} from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { OtpInput } from "react-native-otp-entry";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { url_api } = require("../../impUrl");
const { height, width } = Dimensions.get('window');

export default function MpinCreate({ navigation }) {

  const [loading, setLoading] = useState(false);
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    const getToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('jwt_token');
        console.log("kya aaya userToken",userToken);
        if (userToken) setToken(userToken);
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };
    
    getToken();
  }, []);
  

  useEffect(() => {
    if (errorMessage) setErrorMessage("");
  }, [mpin, confirmMpin]);

  const createMpin = useCallback(async () => {
    if (!token) {
      setErrorMessage("Authentication token missing. Please login again.");
      return;
    }
    console.log("kya aaya token",token);
    setLoading(true);
    
    try {
      const response = await axios.post(
        `${url_api}/api/auth/create-mpin`,
        { mpin},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setLoading(false);
      
      if (response.data.message=="Mpin created successfully") {

        Alert.alert(
          "Success",
          "MPIN created successfully!",
          [{ text: "OK", onPress: () => navigation.reset({ index: 0, routes: [{ name: "Home" }] }) }]
        );
      } else {
        setErrorMessage(response.data?.message || "Failed to create MPIN");
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
      console.error("MPIN creation error:", error);
    }
  }, [mpin, confirmMpin, token, navigation]);

  const handleVerifyMpin = useCallback(() => {
    setErrorMessage("");
    
    if (!mpin || mpin.length !== 4) {
      setErrorMessage("Please enter a valid 4-digit MPIN");
      return;
    }
    
    if (!confirmMpin || confirmMpin.length !== 4) {
      setErrorMessage("Please confirm your MPIN");
      return;
    }
    
    if (mpin !== confirmMpin) {
      setErrorMessage("MPIN does not match. Please try again.");
      return;
    }
    
    createMpin();
  }, [mpin, confirmMpin, createMpin]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <LinearGradient
          colors={['#2563EB', '#1E40AF']}
          style={styles.header}
        >
          <View style={styles.placeholder} />
          <Text style={styles.headerText}>Create MPIN for the new user</Text>
          <View style={styles.placeholder} />
        </LinearGradient>

        <View style={styles.content}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mpinSection}>
              <FontAwesome name="lock" size={40} color="#2563EB" style={styles.lockIcon} />
              <Text style={styles.mpinTitle}>Transaction Security</Text>
              <Text style={styles.mpinSubtitle}>Create a 4-digit MPIN for secure transactions</Text>
              
              <Text style={styles.mpinLabel}>Create Your Transaction Pin</Text>
              <OtpInput
                numberOfDigits={4}
                focusColor="#2563EB"
                autoFocus={true}
                hideStick={true}
                blurOnFilled={true}
                disabled={loading}
                type="numeric"
                secureTextEntry={true}
                focusStickBlinkingDuration={500}
                onTextChange={(text) => setMpin(text)}
                onFilled={(text) => setMpin(text)}
                textInputProps={{
                  accessibilityLabel: "Transaction PIN",
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
              
              <Text style={styles.mpinLabel}>Re-enter Your Transaction Pin</Text>
              <OtpInput
                numberOfDigits={4}
                focusColor="#2563EB"
                autoFocus={false}
                hideStick={true}
                blurOnFilled={true}
                disabled={loading}
                type="numeric"
                secureTextEntry={true}
                focusStickBlinkingDuration={500}
                onTextChange={(text) => setConfirmMpin(text)}
                onFilled={(text) => setConfirmMpin(text)}
                textInputProps={{
                  accessibilityLabel: "Confirm Transaction PIN",
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
              
              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}
            </View>
          </ScrollView>
          
          <View style={styles.bottomContainer}>
            <TouchableOpacity 
              style={[
                styles.submitBtn, 
                loading && styles.submitBtnDisabled,
                (!mpin || !confirmMpin) && styles.submitBtnDisabled
              ]}
              onPress={handleVerifyMpin}
              disabled={loading || !mpin || !confirmMpin}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Create Pin</Text>
                  <FontAwesome name="arrow-right" size={18} color="#fff" style={styles.submitIcon} />
                </>
              )}
            </TouchableOpacity>
            
            <Text style={styles.securityNote}>
              Your MPIN is confidential. Never share it with anyone.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2563EB',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
        paddingHorizontal: 20,
        paddingBottom: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    placeholder: {
        width: 40,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    scrollContent: {
        flexGrow: 1,
    },
    bottomContainer: {
        paddingTop: 10,
    },
    mpinSection: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignSelf: 'center',
    },
    lockIcon: {
        marginBottom: 16,
        alignSelf: 'center',
    },
    mpinTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 8,
        alignSelf: 'center',
    },
    mpinSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    mpinLabel: {
        color: '#2563EB',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    otpContainer: {
        paddingTop: height * 0.01,
        width: width * 0.7,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 16,
        alignSelf: 'center',
    },
    pinCodeContainer: {
        width: width * 0.13,
        height: width * 0.13,
        backgroundColor: '#fff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
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
        transform: [{ scale: 1.05 }],
    },
    filledPinCodeContainer: {
        backgroundColor: '#F1F5F9',
        borderColor: '#2563EB',
    },
    disabledPinCodeContainer: {
        backgroundColor: '#F1F5F9',
        opacity: 0.7,
    },
    errorMessage: {
        color: '#EF4444',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    submitBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    submitBtnDisabled: {
        backgroundColor: '#94a3b8',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    submitIcon: {
        marginLeft: 8,
    },
    securityNote: {
        textAlign: 'center',
        color: '#64748B',
        fontSize: 13,
        marginTop: 16,
        marginBottom: 10,
    },
});