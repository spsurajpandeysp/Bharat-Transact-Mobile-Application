import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url_api } from '../../impUrl';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

const Sidebar = ({ navigation, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        throw new Error("JWT token not found. Please login.");
      }

      const response = await axios.get(`${url_api}/api/user/get-user-by-JWT`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.userDetails) {
        setUserData(response.data.userDetails);
      } else {
        throw new Error("No user details found in response");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('jwt_token');
              navigation.replace('OpenAppLoading');
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
    onClose();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F41B1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F41B1" barStyle="light-content" />
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <AntDesign name="close" size={28} color="#1F41B1" />
      </TouchableOpacity>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* User Profile Section */}
        <LinearGradient colors={["#2563EB", "#1F41B1"]} style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.avatarCircle}>
              <AntDesign name="user" size={50} color="#1F41B1" />
            </View>
          </View>
          <Text style={styles.userName}>
            {userData?.firstName} {userData?.lastName}
          </Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
        </LinearGradient>
        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Your QR Code</Text>
          <View style={styles.qrContainer}>
            {userData?.qrCode ? (
              <QRCode
                value={userData.qrCode}
                size={200}
                backgroundColor="white"
                color="#1F41B1"
              />
            ) : (
              <Text style={styles.noQrText}>QR Code not available</Text>
            )}
          </View>
        </View>
        {/* Divider */}
        <View style={styles.divider} />
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleNavigation('Home')}>
            <MaterialIcons name="home" size={24} color="#1F41B1" />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleNavigation('SendMoney')}>
            <MaterialIcons name="send" size={24} color="#1F41B1" />
            <Text style={styles.menuText}>Send Money</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleNavigation('Scanner')}>
            <MaterialIcons name="qr-code-scanner" size={24} color="#1F41B1" />
            <Text style={styles.menuText}>Scan QR</Text>
          </TouchableOpacity>
        </View>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <MaterialIcons name="logout" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        {/* App Logo/Brand at Bottom */}
        <View style={styles.brandContainer}>
          <FontAwesome name="credit-card" size={28} color="#1F41B1" />
          <Text style={styles.brandText}>Bharat Transact</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 18,
    right: 18,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1F41B1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  profileImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1F41B1',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  icon: {
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  qrSection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F41B1',
    marginBottom: 15,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  noQrText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 18,
    marginHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    backgroundColor: 'white',
  },
  menuText: {
    fontSize: 18,
    color: '#1F41B1',
    marginLeft: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 10,
    marginTop: 10,
    elevation: 2,
  },
  logoutText: {
    fontSize: 18,
    color: '#FF3B30',
    marginLeft: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  brandText: {
    color: '#1F41B1',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default Sidebar;