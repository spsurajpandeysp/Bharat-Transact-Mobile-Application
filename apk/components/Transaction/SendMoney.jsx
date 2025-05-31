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
  FlatList,
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import axios from "axios";

const { url_api } = require("../../impUrl");
const url = url_api;
const { width, height } = Dimensions.get("window");

const SendMoney = ({ navigation, route }) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

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

  useEffect(() => {
    if (route.params?.scannedData) {
      setRecipient(route.params.scannedData);
    }
  }, [route.params?.scannedData]);

  const searchUsers = async (phoneNumber) => {
    if (phoneNumber.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.post(`${url}/api/user/search-users-by-phone`, {
        phoneNumber
      });
      
      if (response.data.users && response.data.users.length > 0) {
        setSearchResults(response.data.users);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRecipientChange = (text) => {
    setRecipient(text);
    searchUsers(text);
  };

  const handleSelectUser = (user) => {
    setRecipient(user.phoneNumber);
    setShowDropdown(false);
  };

  const handleSendMoney = async () => {
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
    try {
      const response = await axios.post(`${url}/api/user/get-user-by-phone-number`, {
        phoneNumber: recipient
      });

      if (response.data.userDetails) {
        navigation.navigate('Mpin', {
          amount: amount,
          recipient: recipient,
          fromScreen: 'SendMoney'
        });
      } else {
        Alert.alert("Error", "Recipient not found. Please check the phone number.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert("Error", "Recipient not found. Please check the phone number.");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleSelectUser(item)}
    >
      <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
      <Text style={styles.userPhone}>{item.phoneNumber}</Text>
    </TouchableOpacity>
  );

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

      <View style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <View style={styles.inputLabelContainer}>
              <FontAwesome name="phone" size={20} color="#2563EB" />
              <Text style={styles.inputLabel}>Recipient Phone Number</Text>
            </View>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter recipient's phone number"
                placeholderTextColor="#666"
                value={recipient}
                onChangeText={handleRecipientChange}
                keyboardType="phone-pad"
              />
              {searchLoading && (
                <ActivityIndicator size="small" color="#2563EB" style={styles.searchLoader} />
              )}
            </View>
            {showDropdown && searchResults.length > 0 && (
              <View style={styles.dropdown}>
                <FlatList
                  data={searchResults}
                  renderItem={renderUserItem}
                  keyExtractor={(item) => item.phoneNumber}
                  style={styles.dropdownList}
                />
              </View>
            )}
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
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendMoney}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Proceed to Pay</Text>
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
  contentContainer: {
    width: width * 0.85,
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
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
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
  searchContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchLoader: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  dropdownList: {
    maxHeight: 200,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  userPhone: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
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
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SendMoney;
