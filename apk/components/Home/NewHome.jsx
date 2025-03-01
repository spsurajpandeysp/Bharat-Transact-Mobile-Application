import React from 'react';
import { ImageBackground, StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import RecentTransactions from '../Transaction/RecentTransactions';
import NewCheck from '../Transaction/NewCheck';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function NewHome({ navigation }) {
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      navigation.replace('OpenAppLoading');
    } catch (error) {
      Alert.alert('An Error Occurred While logging out. Please Try Again Later');
    }
  };

  return (
    <ImageBackground source={require('./bgc.jpg')} style={styles.container}>
      <NewCheck />
      <View style={styles.card2}>   
        <RecentTransactions />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Home")}>
          <AntDesign name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("SendMoney")}>
          <MaterialIcons name="send-to-mobile" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={logout}>
          <AntDesign name="logout" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: height * 0.05,  
  },
  card: {
    width: "90%", 
    height: height * 0.18,  
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: height * 0.05,  
    marginBottom: height * 0.05, 
  },
  card2: {
    width: "90%", 
    height: height * 0.5,  
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: height * 0.05,  
    marginBottom: height * 0.05,
  },
  cardElevated: {
    backgroundColor: '#1F41B1',
    elevation: 4, 
    opacity: 0.8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#000',
    shadowOpacity: 0.3, 
    shadowRadius: 4,
  },
  username: {
    fontSize: height * 0.022,  
    fontWeight: 'bold',
    marginTop: height * 0.01, 
    color: 'white',
  },
  balance: {
    fontSize: height * 0.02, 
    marginTop: height * 0.005,  
    color: 'white',
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004aad",
    paddingVertical: height * 0.03,  
  },
  footerButton: {
    alignItems: "center",
  },
});
