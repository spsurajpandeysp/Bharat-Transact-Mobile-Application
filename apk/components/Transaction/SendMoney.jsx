import React, { useState, useEffect } from "react";
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Alert,ActivityIndicator,ImageBackground,Dimensions} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";

const { url_api } = require("../../impUrl");
const url = url_api;
const { width, height } = Dimensions.get("window");

const SendMoney = ({ navigation }) => {
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("jwt_token");
      navigation.replace("OpenAppLoading");
    } catch (error) {
      Alert.alert("An Error Occurred While logging out. Please Try Again Later");
    }
  };
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt_token");
        if (token) {
          setJwtToken(token);
        } else {
          Alert.alert("Error", "JWT token not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching JWT token:", error);
        Alert.alert("Error", "Failed to retrieve JWT token.");
      }
    };

    fetchToken();
  }, []);

  const handleSendMoney = () => {
    if (!amount || !recipient) {
      Alert.alert("Error", "Please enter both recipient and amount.");
      return;
    }

    if (!jwtToken) {
      Alert.alert("Error", "JWT token is missing. Please log in again.");
      navigation.navigate("Login");
      return;
    }

    setLoading(true); 
    axios
      .post(
        `${url}/api/transaction/send-money`,
        { recipient, amount },
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
          timeout: 20000,
        }
      )
      .then((response) => {
        Alert.alert("Success", `₹${amount} sent to ${recipient}.`);
        setAmount("");
        setRecipient("");
      })
      .catch((error) => {
        console.log(error.response ? error.response.data : error);
        Alert.alert("Error", error.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ImageBackground source={require("./bgc.jpg")} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesome name="arrow-left" size={30} color="#1F41B1" />
      </TouchableOpacity>
      <Text style={styles.headingText}>Send Money</Text>
      <View style={styles.inputs}>
        <View style={styles.RecipientContainer}>
          <FontAwesome
            name={"user"}
            size={24}
            color={"#000"}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Recipient Name"
            style={styles.textInput}
            value={recipient}
            onChangeText={(text) => setRecipient(text.toLowerCase())}
          />
        </View>
        <View style={styles.AmountContainer}>
          <FontAwesome
            name={"money"}
            size={24}
            color={"#000"}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Amount"
            style={styles.textInput}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <View style={[styles.btns, styles.PayBtn]}>
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendMoney}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.btnText}>Proceed To Pay</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Home")}
        >
          <AntDesign name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("SendMoney")}
        >
          <MaterialIcons name="send-to-mobile" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity  onPress={() => navigation.navigate("Scanner")} style={styles.footerButton}>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={logout}>
          <AntDesign name="logout" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SendMoney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.17,
  },
  headingText: {
    color: "#1F41B1",
    fontSize: height * 0.08,
    fontWeight: "900",
  },
  inputs: {
    paddingTop: height * 0.1,
    width: "80%",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: height * 0.02,
    paddingVertical: 10,
  },
  RecipientContainer: {
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
  AmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8,
    height: height * 0.07,
    backgroundColor: "#BED8FE",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 5,
  },
  btns: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  PayBtn: {
    fontSize: height * 0.025,
    color: "white",
    backgroundColor: "#1F41BB",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 50,
    fontWeight: "700",
    width: width * 0.8,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: height * 0.025,
    color: "white",
    fontWeight: "700",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#004aad",
    paddingVertical: 25,
  },
  footerButton: {
    alignItems: "center",
  },
  backButton: {
    position: 'absolute',
    top: height * 0.09,
    left: 20,
    zIndex: 1,
  },
});
