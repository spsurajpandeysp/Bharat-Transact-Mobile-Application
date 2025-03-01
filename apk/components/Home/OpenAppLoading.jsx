import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OpeningLoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const jwtToken = await AsyncStorage.getItem("jwt_token");
        if (jwtToken) {
          navigation.replace("Home");
        } else {
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error reading JWT from AsyncStorage", error);
        navigation.replace("Login");
      }
    }, 5000); 
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default OpeningLoadingScreen;
