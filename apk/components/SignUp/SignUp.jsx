import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert, ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
          console.log(response)
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#1F41B1' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.illustrationWrapper}>
              <View style={styles.dots}>
                <View style={[styles.dot, { backgroundColor: '#22D3EE', left: 10, top: 10 }]} />
                <View style={[styles.dot, { backgroundColor: '#F59E42', left: 60, top: 60 }]} />
                <View style={[styles.dot, { backgroundColor: '#3B82F6', left: 120, top: 30 }]} />
                <View style={[styles.dot, { backgroundColor: '#F43F5E', left: 30, top: 100 }]} />
              </View>
              <View style={styles.circleBg}>
                <Image
                  source={require('../../assets/signup.png')}
                  style={{ width: 120, height: 120 }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={styles.headingText}>Sign Up</Text>
            <Text style={styles.subtitle}>Create your account</Text>
            <View style={styles.inputs}>
              <View style={styles.InputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={styles.InputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
              <View style={styles.InputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.InputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              <View style={styles.InputContainer}>
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
                  Already have an account? <Text style={styles.loginLink}>Sign in</Text>
                </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F41B1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  headingText: {
    color:'#1F41B1',
    fontSize: 26,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  inputs: {
    paddingTop: height * 0.01,
    width: '100%',
  },
  InputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    height: height * 0.07,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 10,
    color: '#2563EB',
  },
  textInput: {
    flex: 1,
    fontSize: height * 0.02,
    paddingVertical: 10,
    color: '#222',
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
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 50,
    fontWeight: "700",
    width: '100%',
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
    color: "#222",
    textAlign: "center",
    fontSize: 16,
    fontWeight: '500',
  },
  loginLink: {
    color: '#1F41B1',
    fontWeight: '700',
    fontSize: 16,
  },
  illustrationWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  circleBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  dots: {
    position: 'absolute',
    width: 180,
    height: 180,
    zIndex: 1,
  },
  dot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    opacity: 0.8,
  },
});

export default New;
