import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, StatusBar, Platform, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { url_api } from '../../impUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function UserDetails({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem('jwt_token');
      const res = await axios.get(`${url_api}/api/user/get-user-by-JWT`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.userDetails);
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#2563EB" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <LinearGradient
        colors={['#2563EB', '#1E40AF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack?.()}
          >
            <FontAwesome name="arrow-left" size={width * 0.055} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User Details</Text>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {user?.qrCode && (
            <View style={styles.qrContainer}>
              <QRCode value={user.qrCode} size={width * 0.32} backgroundColor="white" color="#1F41B1" />
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Account Number</Text>
            <Text style={styles.value}>{user?.accountNumber || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{user?.phoneNumber || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>IFSC Code</Text>
            <Text style={styles.value}>{user?.ifsc || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bank Balance</Text>
            <Text style={styles.value}>₹ {user?.balance ?? 'N/A'}</Text>
          </View>
        </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Bank Name</Text>
            <Text style={styles.value}>₹ {user?.balance ?? 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ifsc Code</Text>
            <Text style={styles.value}>₹ {user?.balance ?? 'N/A'}</Text>
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.03,
    paddingBottom: height * 0.025,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  backButton: {
    width: width * 0.11,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: width * 0.05,
  },
  card: {
    width: width * 0.92,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: width * 0.06,
    marginTop: height * 0.03,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  qrContainer: {
    marginBottom: height * 0.03,
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: 12,
    elevation: 3,
  },
  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: height * 0.01,
  },
  label: {
    fontSize: width * 0.045,
    color: '#1F41B1',
    fontWeight: '600',
  },
  value: {
    fontSize: width * 0.045,
    color: '#222',
    fontWeight: '500',
  },
});
