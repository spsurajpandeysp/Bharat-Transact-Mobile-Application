import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { url_api } = require("../../impUrl");

const { height, width } = Dimensions.get("window");

const ScannedSendMoney = ({ navigation, route }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails,setUserDetails]=useState({});
  const [recipient,setRecipient]=useState("");
  const [jwtToken, setJwtToken] = useState(null);
  const qrcode=route.params?.scannedData;
  console.log("Qrcode",qrcode)
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt_token");
        if (token) {
          setJwtToken(token);
        } else {
          Alert.alert("Error", "JWT token not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching JWT token:", error);
        Alert.alert("Error", "Failed to retrieve JWT token.");
      }
    };

    fetchToken();
  }, []);

  const fetchUserDetails=async()=>{
    try{
      
      const response=await axios.post(`${url_api}/api/user/get-user-by-qr-code`,{qrCode:qrcode},{
      })
      console.log("response",response.data)
      const userDetails=response.data.userDetails;
      setUserDetails(userDetails);
      setRecipient(userDetails.phoneNumber);
    }
    catch(error){
      console.log(error)
    }
  }

  const handleProceed = () => {
    if (!amount || !recipient) {
      Alert.alert("Error", "Please enter both recipient and amount.");
      return;
    }

    if (!jwtToken) {
      Alert.alert("Error", "JWT token is missing. Please log in again.");
      navigation.navigate("Login");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Mpin', {
        amount: amount,
        recipient: recipient,
        fromScreen: 'SendMoney'
      });
    }, 1000);
    
  };
  useEffect(()=>{
    fetchUserDetails();
  },[])

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#2563EB', '#1E40AF']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Send Money</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.userInfoContainer}>
            <View style={styles.userIconContainer}>
              <FontAwesome name="user-circle" size={50} color="#2563EB" />
            </View>
            <Text style={styles.userName}>{userDetails.firstName} {userDetails.lastName}</Text>
            <Text style={styles.userEmail}>{userDetails.phoneNumber}</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputLabelContainer}>
              <FontAwesome name="money" size={20} color="#2563EB" />
              <Text style={styles.inputLabel}>Amount</Text>
            </View>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.proceedButton, loading && styles.proceedButtonDisabled]}
            onPress={handleProceed}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.proceedButtonText}>Proceed to Pay</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '90%',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userIconContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  currencySymbol: {
    fontSize: 20,
    color: '#2563EB',
    fontWeight: '600',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: '#333',
    fontWeight: '500',
  },
  proceedButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  proceedButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScannedSendMoney;