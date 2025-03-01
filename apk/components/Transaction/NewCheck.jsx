import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url_api } from '../../impUrl';

const url = url_api;

const { width, height } = Dimensions.get('window');  

export default function NewCheck() {
  const [balance, setBalance] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  const fetchBalance = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("jwt_token");
      if (!token) {
        throw new Error("JWT token not found. Please login.");
      }
      const response = await axios.get(`${url}/api/user/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setBalance(response.data.balance);
      setUserName(response.data.name);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setTimeout(()=>{setIsLoading(false);
    },500)
  }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(prevState => !prevState);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.elevatedCard]}>
      <View style={styles.container}>
        <AntDesign name="user" size={50} color="white" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>{userName}</Text>
          <Text style={styles.accountInfo}>Account Balance:</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balance}>
              {isBalanceVisible ? `₹ ${balance}` : "₹XXXX"}
            </Text>
            <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeIconContainer}>
              <AntDesign name={isBalanceVisible ? "eye" : "eyeo"} size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F41B1',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFCDD2',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  card: {
    width: width * 0.9, 
    height: 150,  
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12, 
    backgroundColor: '#1F41B1',
    padding: 20,
  },
  elevatedCard: {
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headingText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  accountInfo: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginTop: 5,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  balance: {
    fontSize: 24,
    color: 'white',
    fontWeight: '900',
    marginRight: 10,
  },
  eyeIconContainer: {
    marginLeft: 100, 
  },
});
