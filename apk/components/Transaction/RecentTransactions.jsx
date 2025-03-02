import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url_api } from '../../impUrl';

const url = url_api;

const RecentTransactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt_token');
        if (!token) {
          console.error('JWT not found in AsyncStorage');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${url}/api/transaction/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const reversedTransactions = response.data.transactions.reverse();
        setTransactions(reversedTransactions || []);
      } catch (error) {
        console.error('Error fetching transactions:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);
  
  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>
        <Text style={styles.bold}>
          {item.toUser.firstName} {item.toUser.lastName}
        </Text>
        {" "}received ₹{item.amount}
      </Text>
      <Text style={styles.transactionDate}>Transaction ID: {item.transactionId}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Transactions</Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F41B1" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.transactionId}
          contentContainerStyle={styles.transactionsList}
        />
      )}
      {transactions.length === 0 && !loading && (
        <Text style={styles.noTransactions}>No transactions found.</Text>
      )}
    </View>
  );
};

export default RecentTransactions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F41B1',
    marginBottom: 20,
    textAlign: 'center',
  },

  transactionsList: {
    paddingHorizontal: 15,
    paddingBottom: 60,
  },

  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  transactionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },

  transactionDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },

  bold: {
    fontWeight: 'bold',
  },

  noTransactions: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
