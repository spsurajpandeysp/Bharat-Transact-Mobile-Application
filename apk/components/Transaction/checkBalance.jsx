import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { url_api } from '../../impUrl';

const url = url_api;

const CheckBalance = () => {
  const [balance, setBalance] = useState(null);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
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

    
      setBalance(response.data.balance);
      setUserName(response.data.userName);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

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
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Account Balance</Text>
      <Text style={styles.balanceAmount}>₹{balance}</Text>
      <Text style={styles.balanceUser}>{userName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1F41B1",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFCDD2",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  balanceCard: {
    backgroundColor: "#1F41B1", 
    width: "90%",
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 10, 
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  balanceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  balanceUser: {
    fontSize: 20,
    color: "white",
  },
});

export default CheckBalance;
