import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const TransactionSuccessfull = ({ navigation, route }) => {
  // Example data, replace with route.params or props as needed
  const amount = route?.params?.amount || '1225';
  const date = route?.params?.date || '31 Dec 2023';
  const details = route?.params?.details || 'Residential';
  const reference = route?.params?.reference || 'A06453826151';
  const account = route?.params?.account || 'Neeraj';
  const totalPayment = route?.params?.totalPayment || '1200';
  const tax = route?.params?.tax || '25';
  const total = route?.params?.total || amount;

  return (
    <View style={styles.bg}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="close" size={28} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.cardShadow}>
        <View style={styles.card}>
          <View style={styles.checkCircleWrapper}>
            <LinearGradient colors={["#2563EB", "#2563EB"]} style={styles.checkCircle}>
              <FontAwesome name="check" size={32} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.paymentTotalLabel}>Payment Total</Text>
          <Text style={styles.amountText}>₹{amount}</Text>
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Details</Text>
              <Text style={styles.detailValue}>{details}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Reference num</Text>
              <Text style={styles.detailValue}>{reference}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Account</Text>
              <Text style={styles.detailValue}>{account}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Payment</Text>
              <Text style={styles.detailValue}>₹{totalPayment}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tax</Text>
              <Text style={styles.detailValue}>₹{tax}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabelBold}>Total</Text>
              <Text style={styles.detailValueBold}>₹{total}</Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}> 
        <Text style={styles.homeBtnText}>Back to Homepage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.08,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.9,
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 32,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    width: width * 0.9,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  checkCircleWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    marginBottom: 8,
  },
  paymentTotalLabel: {
    color: '#A0AEC0',
    fontSize: 16,
    marginBottom: 2,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#222',
    marginBottom: 18,
  },
  detailsSection: {
    width: '100%',
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#A0AEC0',
    fontSize: 15,
    fontWeight: '500',
  },
  detailValue: {
    color: '#222',
    fontSize: 15,
    fontWeight: '500',
  },
  detailLabelBold: {
    color: '#222',
    fontSize: 16,
    fontWeight: '700',
  },
  detailValueBold: {
    color: '#222',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginVertical: 10,
  },
  homeBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: width * 0.8,
    marginBottom: 10,
  },
  homeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default TransactionSuccessfull; 