import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EnterAmount = ({ route, navigation }) => {
  const { recipientId, recipientName } = route.params;
  const [amount, setAmount] = useState('');

  const handleContinue = () => {
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    navigation.navigate('SendMoney', {
      recipientId,
      recipientName,
      amount: amountNum,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Amount</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.recipientText}>
          Sending to: {recipientName}
        </Text>

        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
          />
        </View>

        <View style={styles.quickAmounts}>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => setAmount('100')}
          >
            <Text style={styles.quickAmountText}>₹100</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => setAmount('500')}
          >
            <Text style={styles.quickAmountText}>₹500</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAmountButton}
            onPress={() => setAmount('1000')}
          >
            <Text style={styles.quickAmountText}>₹1000</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !amount && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!amount}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.continueButton, !amount && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!amount}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.continueButton, !amount && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!amount}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.continueButton, !amount && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!amount}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F41B1',
    paddingTop: 50,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  recipientText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1F41B1',
    marginRight: 10,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1F41B1',
    width: 200,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  quickAmountButton: {
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
  },
  quickAmountText: {
    fontSize: 16,
    color: '#1F41B1',
  },
  continueButton: {
    backgroundColor: '#1F41B1',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnterAmount; 