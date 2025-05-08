import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url_api } from '../../impUrl';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BillPaymentForm = ({ route, navigation }) => {
  const { category, bill } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(bill?.amount?.replace('₹', '') || '');
  const [billNumber, setBillNumber] = useState(bill?.billNumber || '');
  const [operator, setOperator] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const getCategoryDetails = () => {
    switch (category) {
      case 'mobile':
        return {
          title: 'Mobile Recharge',
          icon: 'phone-android',
          color: '#4CAF50',
          fields: ['operator', 'mobileNumber', 'amount'],
        };
      case 'electricity':
        return {
          title: 'Electricity Bill',
          icon: 'flash-on',
          color: '#FFC107',
          fields: ['billNumber', 'amount'],
        };
      case 'water':
        return {
          title: 'Water Bill',
          icon: 'water-drop',
          color: '#2196F3',
          fields: ['billNumber', 'amount'],
        };
      case 'gas':
        return {
          title: 'Gas Bill',
          icon: 'local-fire-department',
          color: '#FF5722',
          fields: ['billNumber', 'amount'],
        };
      case 'broadband':
        return {
          title: 'Broadband Bill',
          icon: 'wifi',
          color: '#9C27B0',
          fields: ['operator', 'billNumber', 'amount'],
        };
      case 'dth':
        return {
          title: 'DTH/Cable TV',
          icon: 'tv',
          color: '#E91E63',
          fields: ['operator', 'billNumber', 'amount'],
        };
      case 'education':
        return {
          title: 'Education Fee',
          icon: 'school',
          color: '#3F51B5',
          fields: ['billNumber', 'amount'],
        };
      case 'insurance':
        return {
          title: 'Insurance Premium',
          icon: 'health-and-safety',
          color: '#009688',
          fields: ['billNumber', 'amount'],
        };
      default:
        return {
          title: 'Bill Payment',
          icon: 'receipt',
          color: '#1F41B1',
          fields: ['billNumber', 'amount'],
        };
    }
  };

  const categoryDetails = getCategoryDetails();

  const validateInputs = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return false;
    }
    if (categoryDetails.fields.includes('billNumber') && !billNumber) {
      Alert.alert('Error', 'Please enter bill number');
      return false;
    }
    if (categoryDetails.fields.includes('operator') && !operator) {
      Alert.alert('Error', 'Please select operator');
      return false;
    }
    if (categoryDetails.fields.includes('mobileNumber') && !mobileNumber) {
      Alert.alert('Error', 'Please enter mobile number');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      const response = await axios.post(
        `${url_api}/api/bills/pay`,
        {
          category,
          amount: parseFloat(amount),
          billNumber,
          operator,
          mobileNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        navigation.navigate('TransactionSuccessfull', {
          transactionId: response.data.transactionId,
          amount: amount,
          type: categoryDetails.title
        });
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to process payment'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>{categoryDetails.title}</Text>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>

      <KeyboardAwareScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.formContainer}>
          {categoryDetails.fields.includes('operator') && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Operator</Text>
              <TextInput
                style={styles.input}
                value={operator}
                onChangeText={setOperator}
                placeholder="Enter operator name"
                placeholderTextColor="#999"
              />
            </View>
          )}

          {categoryDetails.fields.includes('mobileNumber') && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="numeric"
                placeholder="Enter mobile number"
                placeholderTextColor="#999"
                maxLength={10}
              />
            </View>
          )}

          {categoryDetails.fields.includes('billNumber') && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bill Number</Text>
              <TextInput
                style={styles.input}
                value={billNumber}
                onChangeText={setBillNumber}
                placeholder="Enter bill number"
                placeholderTextColor="#999"
              />
            </View>
          )}

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
        </View>
        <View style={styles.footerInScroll}>
          <TouchableOpacity
            style={[styles.payButton, isLoading && styles.disabledButton]}
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.payButtonText}>Proceed to Pay</Text>
                <MaterialIcons name="arrow-forward" size={24} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 30 }} />
      </KeyboardAwareScrollView>
    </View>
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 16,
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
  footerInScroll: {
    marginTop: 10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  payButton: {
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
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default BillPaymentForm;