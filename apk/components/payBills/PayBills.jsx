import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PayBills = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const billCategories = [
    { id: 'mobile', name: 'Mobile Recharge', icon: 'phone-android', color: '#4CAF50' },
    { id: 'electricity', name: 'Electricity', icon: 'flash-on', color: '#FFC107' },
    { id: 'water', name: 'Water Bill', icon: 'water-drop', color: '#2196F3' },
    { id: 'gas', name: 'Gas Bill', icon: 'local-fire-department', color: '#FF5722' },
    { id: 'broadband', name: 'Broadband', icon: 'wifi', color: '#9C27B0' },
    { id: 'dth', name: 'DTH/Cable TV', icon: 'tv', color: '#E91E63' },
    { id: 'education', name: 'Education', icon: 'school', color: '#3F51B5' },
    { id: 'insurance', name: 'Insurance', icon: 'health-and-safety', color: '#009688' },
  ];

  const recentBills = [
    { id: 1, name: 'BSES Electricity', billNumber: '1234567890', amount: '₹2,500', dueDate: '15 Mar 2024' },
    { id: 2, name: 'Airtel Mobile', billNumber: '9876543210', amount: '₹499', dueDate: '20 Mar 2024' },
  ];

  const renderBillCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => navigation.navigate('BillPaymentForm', { 
        category: category.id,
        title: category.name 
      })}
    >
      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
        <MaterialIcons name={category.icon} size={24} color={category.color} />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const renderRecentBill = (bill) => (
    <TouchableOpacity
      key={bill.id}
      style={styles.recentBillCard}
      onPress={() => navigation.navigate('BillPaymentForm', { 
        category: 'electricity', // or determine based on bill type
        bill: bill 
      })}
    >
      <View style={styles.recentBillHeader}>
        <Text style={styles.recentBillName}>{bill.name}</Text>
        <Text style={styles.recentBillAmount}>{bill.amount}</Text>
      </View>
      <View style={styles.recentBillDetails}>
        <Text style={styles.recentBillNumber}>Bill No: {bill.billNumber}</Text>
        <Text style={styles.recentBillDue}>Due: {bill.dueDate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1F41B1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Bills</Text>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF5015' }]}>
              <MaterialIcons name="history" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#2196F315' }]}>
              <MaterialIcons name="schedule" size={24} color="#2196F3" />
            </View>
            <Text style={styles.quickActionText}>Scheduled</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FFC10715' }]}>
              <MaterialIcons name="receipt" size={24} color="#FFC107" />
            </View>
            <Text style={styles.quickActionText}>Bills</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Bills */}
        {recentBills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Bills</Text>
            {recentBills.map(renderRecentBill)}
          </View>
        )}

        {/* Bill Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay Bills</Text>
          <View style={styles.categoriesGrid}>
            {billCategories.map(renderBillCategory)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 12,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F41B1',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  recentBillCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recentBillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentBillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentBillAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F41B1',
  },
  recentBillDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentBillNumber: {
    fontSize: 13,
    color: '#666',
  },
  recentBillDue: {
    fontSize: 13,
    color: '#666',
  },
});

export default PayBills;