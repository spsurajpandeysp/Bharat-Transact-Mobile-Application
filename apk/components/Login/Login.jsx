import { ActivityIndicator, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions, ImageBackground, Alert } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { url_api } from '../../impUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

const url = url_api;

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible,setPasswordVisible]=useState(false);
  const handleLogin = () => {
    if (loading) return; 

    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password!");
      return;
    }

    setLoading(true); 
    axios.post(`${url}/auth/api/login`, { email, password })
      .then(async (response) => {
        const jwt = response.data.token;
        if (jwt) {
          await AsyncStorage.setItem("jwt_token", jwt);
          navigation.navigate("Home");
        } else {
          Alert.alert("Error", "Invalid credentials or no token returned.");
        }
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes("User not found")) {
            Alert.alert("Error", "User not found. Please check your email.");
          } else if (errorMessage.includes("Invalid credentials")) {
            Alert.alert("Error", "Invalid password. Please try again.");
          } else if (errorMessage.includes("Please verify your email before logging in.")) {
            Alert.alert("Error", "Please verify your email before logging in.");
            navigation.navigate("EmailVerifyOtp", { email, from: "LoginPage" });
          } else {
            Alert.alert("Error", errorMessage || "Login failed. Please try again later.");
          }
        } else {
          Alert.alert("Error", "Unable to connect to the server. Please try again later.");
        }
      })
      .finally(() => setLoading(false)); 
  };
  const handleCreateAccount = () => {
    navigation.navigate("SignUp"); 
  };
  const togglePasswordVisibility=()=>{
    setPasswordVisible(prevState=>!prevState);
  };
  return (
    <>
      <ImageBackground 
        source={require('./bgc.jpg')}  
        style={styles.container}
      >
      <Text style={styles.headingText}>Login Here</Text> 
      <View style={styles.content}>
        <Text style={styles.contentText}>Welcome Back</Text>
      </View>
      <View style={styles.inputs}>
        <View style={styles.emailContainer}>
          <FontAwesome name={"envelope"} size={24} color={"#000"} style={styles.inputIcon} />
          <TextInput 
            placeholder='Email' 
            style={styles.textInput} 
            value={email} 
            onChangeText={(text) => setEmail(text.toLowerCase())}
          />
        </View>
        <View style={styles.passwordContainer}>
          <FontAwesome name={"lock"} size={24} color={"#000"} style={styles.inputIcon} />
          <TextInput 
            placeholder="Password" 
            secureTextEntry={!isPasswordVisible}
            style={styles.textInput} 
            value={password} 
            onChangeText={(text) => setPassword(text.toLowerCase())} 
          />
           <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={togglePasswordVisibility}
          >
            <AntDesign 
              name={isPasswordVisible ? "eyeo" : "eye"} 
              size={20} 
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity>
          <Text 
            onPress={() => navigation.navigate('ForgotPassword')} 
            style={styles.forgotPassword}
          >
            Forgot your password?
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btns}>
        <TouchableOpacity 
          onPress={handleLogin} 
          disabled={loading} 
        >
          <View style={styles.LoginBtn}>
            {loading ? (
              <ActivityIndicator size="small" color="white" /> 
            ) : (
              <Text style={styles.btnText}>Login</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.CreateContainer}>
                <Text style={styles.CreateContainerText} onPress={handleCreateAccount}> Create New Account </Text>
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
  headingText: {
    color: "#1F41B1",  
    fontSize: height * 0.08,  
    fontWeight: "900", 
  },
  content: {
    paddingTop: 25
  },
  contentText: {
    fontSize: height * 0.04,  
    fontWeight: "900",
  },
  inputs: {
    paddingTop: height * 0.08, 
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8, 
    height: height * 0.07,  
    backgroundColor: "#BED8FE",
    borderRadius: 10,
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
  forgotPasswordContainer: {
    width: width * 0.8,  
    marginTop: 10,
    alignItems: 'flex-end',  
  },
  forgotPassword: {
    color: '#1F41BB',  
    fontSize: height * 0.02,  
    textAlign: 'right',
    marginTop: 10,
  },
  btns: {
    paddingTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center"
  },
  LoginBtn: {
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
  CreateContainer: {
    textAlign: "center",
    marginTop: 50,
  },
  CreateContainerText: {
    color: "#1F41B1",
    textAlign: "center",
    fontSize: 18,
    fontWeight:'900'
  },
});
