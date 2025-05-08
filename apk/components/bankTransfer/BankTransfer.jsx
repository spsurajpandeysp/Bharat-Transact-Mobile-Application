import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url_api } from '../../impUrl';

const BankTransfer = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchSavedAccounts();
  }, []);

  const fetchSavedAccounts = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await axios.get(`${url_api}/api/user/saved-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedAccounts(response.data.accounts || []);
    } catch (error) {
      console.error('Error fetching saved accounts:', error);
    }
  };

  const validateInputs = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    if (!accountNumber || accountNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid account number');
      return false;
    }
    if (!ifscCode || ifscCode.length !== 11) {
      Alert.alert('Error', 'Please enter a valid IFSC code');
      return false;
    }
    if (!accountHolderName.trim()) {
      Alert.alert('Error', 'Please enter account holder name');
      return false;
    }
    return true;
  };

  const handleTransfer = async () => {
    if (!validateInputs()) return;

    navigation.navigate('MPIN', {
      type: 'bank_transfer',
      amount: parseFloat(amount),
      accountNumber,
      ifscCode,
      accountHolderName,
      onSuccess: (transactionId) => {
        navigation.navigate('TransactionSuccessfull', {
          transactionId,
          amount: amount,
          recipientName: accountHolderName,
          type: 'Bank Transfer'
        });
      }
    });
  };

  const selectSavedAccount = (account) => {
    setSelectedAccount(account);
    setAccountNumber(account.accountNumber);
    setIfscCode(account.ifscCode);
    setAccountHolderName(account.accountHolderName);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#2563EB', '#1F41B1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bank Transfer</Text>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {savedAccounts.length > 0 && (
          <View style={styles.savedAccountsContainer}>
            <Text style={styles.sectionTitle}>Saved Accounts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {savedAccounts.map((account, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.savedAccountCard,
                    selectedAccount?.accountNumber === account.accountNumber && styles.selectedAccount
                  ]}
                  onPress={() => selectSavedAccount(account)}
                >
                  <FontAwesome name="bank" size={24} color="#1F41B1" />
                  <Text style={styles.accountName}>{account.accountHolderName}</Text>
                  <Text style={styles.accountNumber}>
                    ****{account.accountNumber.slice(-4)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Number</Text>
            <TextInput
              style={styles.input}
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              placeholder="Enter account number"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>IFSC Code</Text>
            <TextInput
              style={styles.input}
              value={ifscCode}
              onChangeText={(text) => setIfscCode(text.toUpperCase())}
              placeholder="Enter IFSC code"
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Account Holder Name</Text>
            <TextInput
              style={styles.input}
              value={accountHolderName}
              onChangeText={setAccountHolderName}
              placeholder="Enter account holder name"
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.transferButton, isLoading && styles.disabledButton]}
          onPress={handleTransfer}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.transferButtonText}>Proceed to Transfer</Text>
              <MaterialIcons name="arrow-forward" size={24} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  savedAccountsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F41B1',
    marginBottom: 10,
  },
  savedAccountCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    width: 150,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedAccount: {
    borderColor: '#1F41B1',
    borderWidth: 2,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F41B1',
    marginTop: 8,
  },
  accountNumber: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F41B1',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  transferButton: {
    backgroundColor: '#1F41B1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  transferButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default BankTransfer;