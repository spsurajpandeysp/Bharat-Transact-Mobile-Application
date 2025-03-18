import { ImageBackground, StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { url_api } from '../../impUrl';
import axios from 'axios';

const { width, height } = Dimensions.get("window");
const url = url_api;

const New = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all the fields!");
      return;
    }
    const emailRegex= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com/;
        if(!emailRegex.test(email)){
          Alert.alert("Error","Please Enter Valid Email")
        }
        const passwordRegex=/^(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/-])(?=.*\d).{7}$/
        if(!passwordRegex.test(password)){
          Alert.alert("Error","Password must be 7 characters long, contain at least one special character and number");
        }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    setLoading(true); 
    axios.post(`${url}/auth/api/signup`, {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    }, { timeout: 20000 })
      .then((response) => {
        setLoading(false);
        if (response.status === 201 || response.status === 200) {
          navigation.navigate("EmailVerifyOtp", { email });
        } else {
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 400) {
            Alert.alert("Error", error.response.data.message || "All fields are required.");
          } else if (error.response.status === 409) {
            Alert.alert("Error", error.response.data.message || "User already exists.");
          } else {
            Alert.alert("Error", "Something went wrong. Please try again.");
          }
        } else {
          Alert.alert("Error", "Unable to connect to the server. Please check your internet connection.");
        }
      });
  };
  return (
    <ImageBackground
      source={require('./bgc.jpg')}
      style={styles.container}
    >
      <Text style={styles.headingText}>Create Account</Text>
      <View style={styles.inputs}>
        <View style={styles.InputContainer}>
          <FontAwesome name={"user"} size={24} color={"#000"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome name={"user"} size={24} color={"#000"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome name={"envelope"} size={24} color={"#000"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome name={"lock"} size={24} color={"#000"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.InputContainer}>
          <FontAwesome name={"lock"} size={24} color={"#000"} style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.btns}>
        <TouchableOpacity onPress={handleSignup} disabled={loading}>
          <View style={styles.SignUps}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.btnText}>Sign Up</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.CreateContainer}>
          <Text
            style={styles.CreateContainerText}
            onPress={() => navigation.navigate('Login')}
          >
            Already Have an Account
          </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.11,
  },
  headingText: {
    color: "#1F41B1",
    fontSize: height * 0.08,
    fontWeight: "900",
  },
  inputs: {
    paddingTop: height * 0.01,
    width: "80%",
  },
  InputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: "#BED8FE",
    borderRadius: 10,
    marginBottom: 15,
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
  btns: {
    paddingTop: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
  },
  SignUps: {
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
    marginTop: 15,
  },
  CreateContainerText: {
    color: "#1F41B1",
    textAlign: "center",
    fontSize: 18,
    fontWeight: '900',
  },
});

export default New;
