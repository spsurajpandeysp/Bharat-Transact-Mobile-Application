import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import { url_api } from '../../impUrl'; 
const { width, height } = Dimensions.get("window");
const url = url_api;

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${url}/auth/api/forget-password`, { email });

      if (response.status === 200) {
        navigation.navigate("ForgetPasswordVerifyOtp", { email });  
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert("Error", "Account not found. Please check your email address.");
      } else {
        Alert.alert("Error", error.response?.data?.message || "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ImageBackground
      source={require('./bgc.jpg')}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={30} color="#1F41B1" />
      </TouchableOpacity>
      <Text style={styles.headingText}>Forgot Password</Text>
      <View style={styles.content}>
        <Text style={styles.contentText}>Please enter your email to reset the password</Text>
      </View>
      <View style={styles.inputs}>
        <View style={styles.emailContainer}>
          <FontAwesome name={"user"} size={24} color={"#000"} style={styles.inputIcon} />
          <TextInput
            placeholder='Email'
            style={styles.textInput}
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            keyboardType="email-address"
            autoCapitalize="none"
            />
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={handleNext} disabled={loading}> 
          <View style={styles.ResetButton}>
            {loading ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <Text style={styles.btnText}>Reset Password</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.2,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.09,
    left: 20,
    zIndex: 1,  
  },
  headingText: {
    color: "#1F41B1",
    fontSize: height * 0.08,
    fontWeight: "900",
  },
  content: {
    paddingTop: 25,
  },
  contentText: {
    fontSize: height * 0.02,
    fontWeight: "800",
  },
  inputs: {
    paddingTop: height * 0.05,
    width: "80%",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: "#BED8FE",
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: height * 0.02,
    paddingVertical: 10,
  },
  ResetButton: {
    fontSize: height * 0.025,
    color: 'white',
    backgroundColor: '#1F41BB',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 50,
    fontWeight: "700",
    width: width * 0.8,
    textAlign: "center",
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: height * 0.025,
    color: 'white',
    fontWeight: "700",
  },
});
