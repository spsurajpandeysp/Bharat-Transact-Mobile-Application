import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { OtpInput } from "react-native-otp-entry";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
const {height,width}=Dimensions.get('window');

export default function Mpin({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const [mpin, setMpin] = useState("");

    const handleVerifyMpin = () => {
        if (!mpin || mpin.length !== 4) {
            Alert.alert("Error", "Please enter a valid 4-digit MPIN.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (route.params?.fromScreen === 'SendMoney' || route.params?.fromScreen === 'ScannedSendMoney') {
                navigation.navigate('TransactionSuccessfull', {
                    amount: route.params.amount,
                    recipient: route.params.recipient,
                    // Add more fields if needed
                });
            }
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2563EB', '#1E40AF']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Enter MPIN</Text>
                <View style={styles.placeholder} />
            </LinearGradient>

            <View style={styles.content}>
                <View style={styles.transactionInfo}>
                    <View style={styles.amountRow}>
                        <Text style={styles.amountLabel}>Amount:</Text>
                        <Text style={styles.amountValue}>₹{route.params?.amount || '0.00'}</Text>
                    </View>
                    <View style={styles.recipientRow}>
                        <Text style={styles.recipientLabel}>To:</Text>
                        <Text style={styles.recipientValue}>{route.params?.recipient || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.mpinSection}>
                    <Text style={styles.mpinLabel}>Enter Your Transaction Pin</Text>
                    <OtpInput
                        numberOfDigits={4}
                        focusColor="#2563EB"
                        autoFocus={true}
                        hideStick={true}
                        blurOnFilled={true}
                        disabled={false}
                        type="numeric"
                        secureTextEntry={true}
                        focusStickBlinkingDuration={500}
                        onFilled={(text) => setMpin(text)}
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
                </View>

                <TouchableOpacity 
                    style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                    onPress={handleVerifyMpin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.submitBtnText}>Pay Now</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: height * 0.05,
        paddingHorizontal: 20,
        paddingBottom: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backButton: {
        padding: 10,
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    transactionInfo: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    amountLabel: {
        fontSize: 14,
        color: '#64748B',
        marginRight: 8,
    },
    amountValue: {
        fontSize: 18,
        color: '#1E293B',
        fontWeight: '600',
    },
    recipientRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recipientLabel: {
        fontSize: 14,
        color: '#64748B',
        marginRight: 8,
    },
    recipientValue: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '500',
    },
    mpinSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    mpinLabel: {
        color: '#2563EB',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    otpContainer: {
        paddingTop: height * 0.02,
        width: width * 0.7,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    pinCodeContainer: {
        width: width * 0.12,
        height: height * 0.06,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    focusStick: {
        height: 4,
        backgroundColor: '#2563EB',
    },
    activePinCodeContainer: {
        borderColor: '#2563EB',
        borderWidth: 2,
    },
    filledPinCodeContainer: {
        backgroundColor: '#F8FAFC',
        borderColor: '#2563EB',
    },
    disabledPinCodeContainer: {
        backgroundColor: '#F1F5F9',
    },
    submitBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    submitBtnDisabled: {
        backgroundColor: '#94a3b8',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});