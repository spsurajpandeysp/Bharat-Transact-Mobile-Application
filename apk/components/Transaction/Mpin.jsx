import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { OtpInput } from "react-native-otp-entry";
import FontAwesome from '@expo/vector-icons/FontAwesome';
const {height,width}=Dimensions.get('window');

export default function Mpin() {
    // const {name}=route.params;
    // const {senderAccount}=route.params;
    // const {recieverAccount}=route.params;
  return (
    <ImageBackground source={require("./bgc.jpg")} style={styles.container}>
      <Text style={styles.headingText}>Enter Your Transaction Pin</Text>
    
    <OtpInput
            numberOfDigits={4}
            focusColor="blue"
            autoFocus={false}
            hideStick={true}
            blurOnFilled={true}
            disabled={false}
            type="numeric"
            secureTextEntry={true}
            focusStickBlinkingDuration={500}
            onFilled={(text) => console.log(`OTP entered: ${text}`)}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.pinCodeContainer,
              focusStickStyle: styles.focusStick,
              focusedPinCodeContainerStyle: styles.activePinCodeContainer,
              filledPinCodeContainerStyle: styles.filledPinCodeContainer,
              disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
            }}
          />
          <View style={{flexDirection:"row"}}>
          <FontAwesome name="warning" size={24} color="orange" marginLeft={8}/>
          {/* <Text style={styles.warningText}>You are Sending  ₹ {amount} from your {senderAccount} to {recieverAccount}</Text> */}
          </View>
            <TouchableOpacity>
                <View style={styles.submitBtn}>
                    <Text style={styles.submitBtnText}>
                    Submit</Text>
                </View>
            </TouchableOpacity>

    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center',
        paddingTop:height*0.15,  
    },
    headingText:{
        color:'#1F41B1',
        fontSize:height*0.06,
        fontWeight:'900',
        textAlign:'center',
        paddingBottom:height*0.05,
    },
    otpContainer: {
        paddingTop: height * 0.04,
        width: width * 0.6,
        justifyContent: 'space-evenly',
        alignItems: 'center',
      },
      pinCodeContainer: {
        width: width * 0.04,
        height: height * 0.02,
        backgroundColor: '#fff',
        borderRadius: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
      },
      focusStick: {
        height: 4,
        backgroundColor: 'blue',
      },
      activePinCodeContainer: {
        borderColor: 'blue',
        borderWidth: 2,
      },
      filledPinCodeContainer: {
        backgroundColor: 'black',
      },
      disabledPinCodeContainer: {
        backgroundColor: '#d1d1d1',
      },
      submitBtn: {
        marginTop:height*0.07,
        backgroundColor: '#1F41BB',
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 50,
        width: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
      },
      submitBtnText: {
        fontSize: height * 0.025,
        color: 'white',
        fontWeight: "700",
      },
      warningText:{
        fontSize: height * 0.02,
        fontWeight:"bold",
        textAlign:'center',
        justifyContent:'space-evenly',
      }
})