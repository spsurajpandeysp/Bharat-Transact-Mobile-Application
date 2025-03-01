import { StyleSheet, Text, View,ImageBackground,Dimensions,TouchableOpacity,TextInput,Alert,ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { url_api } from '../../impUrl';

const {width,height}=Dimensions.get("window");
const url=url_api
export default function ConfirmPassword({navigation,route}) {
  const {email,otp}=route.params;
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [resending,setResending]=useState(false);

  const handleSubmit=async()=>{
    if(!password || !confirmPassword){
        Alert.alert("Error","Please fill all fields");
        return;
    }
    if(password!==confirmPassword){
        Alert.alert("Error","Passwords do not match");
        return;
    }
    setLoading(true);
    try{
        const response=await axios.post(`${url}/auth/api/reset-password`,{
            email,
            otp,
            newPassword:password,
            confirmNewPassword:confirmPassword,
        });
        if(response.status===200){
            Alert.alert("Success",response.data.message || "Password Reset Successfully!");
            navigation.navigate("Login");
        }
    }
        catch(error){
            Alert.alert("Error",error.response?.data?.message || "Something went wrong. Please try again.");
        } finally{
            setLoading(false);
        }
  };

  return (
    <ImageBackground source={require('./bgc.jpg')} style={styles.container}>
        <TouchableOpacity onPress={()=>navigation.goBack()}style={styles.backButton}>
            <FontAwesome name="arrow-left" size={30} color='#1F41B1' />
        </TouchableOpacity>
        <Text style={styles.headingText}>Create Your Password</Text>
        <View style={styles.inputs}>
            <View style={styles.passwordContainer}>
                      <FontAwesome name={"lock"} size={24} color={"#000"} style={styles.inputIcon} />
                      <TextInput 
                        placeholder="New Password" 
                        secureTextEntry 
                        style={styles.textInput} 
                        value={password}
                        onChangeText={setPassword}
                      />
            </View>
            <View style={styles.passwordContainer}>
                <FontAwesome name={"lock"} size={24} color={"#000"} style={styles.inputIcon} />
                  <TextInput 
                    placeholder="Confirm Password" 
                    secureTextEntry 
                    style={styles.textInput} 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
            </View>
        </View>
        <TouchableOpacity onPress={handleSubmit}>
                <View style={styles.verifyBtn}>
                  <Text style={styles.verifyBtnText}>
                    {loading?<ActivityIndicator size="small" color="white"/>:"Submit"}
                  </Text>
                </View>
              </TouchableOpacity>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-start',
        paddingTop:height*0.2,
    },
    backButton:{
        position:'absolute',
        top:height*0.09,
        left:20,
        zIndex:1,
    },
    headingText:{
        color:'#1F41B1',
        fontSize:height*0.08,
        fontWeight:'900',
    },
    inputs: {
        paddingTop: height * 0.05, 
        width: "80%", 
    },
    inputIcon: {
        marginRight: 10,
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
        marginBottom: 25,
      },
      verifyBtn: {
        backgroundColor: '#1F41BB',
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 50,
        width: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      verifyBtnText: {
        fontSize: height * 0.025,
        color: 'white',
        fontWeight: "700",
      },

})