import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import Sidebar from '../Sidebar/sidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url_api } from '../../impUrl';
import RecentTransactions from '../Transaction/RecentTransactions';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.8;

const NewHome = ({ navigation }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [userData, setUserData] = useState(null);
  const [showBalance, setShowBalance] = useState(false);
  const [balanceAnim] = useState(new Animated.Value(1));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        navigation.replace('OpenAppLoading');
        return;
      }
      const response = await axios.get(`${url_api}/api/user/get-user-by-JWT`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.userDetails) {
        console.log(response.data.userDetails);
        if(response.data.userDetails.mpin==""){
          navigation.navigate('MpinCreate');
        }
        setUserData(response.data.userDetails);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleBalanceToggle = () => {
    Animated.timing(balanceAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowBalance((prev) => !prev);
      Animated.timing(balanceAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -SIDEBAR_WIDTH : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F41B1" barStyle="light-content" />
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}>
        <Sidebar navigation={navigation} onClose={toggleSidebar} />
      </Animated.View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
            <MaterialIcons name="menu" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bharat Transact</Text>
          <View style={styles.headerRight} />
        </View>
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <ImageBackground
            source={require('../Home/bgc.jpg')}
            style={styles.content}>
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeHeader}>
                <Text style={styles.welcomeText}>
                  Welcome, {userData?.firstName || 'User'}
                </Text>
                <TouchableOpacity style={styles.notificationButton}>
                  <MaterialIcons name="notifications" size={24} color="#1F41B1" />
                </TouchableOpacity>
              </View>
              <View style={styles.balanceContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Animated.Text
                      style={[
                        styles.balanceText,
                        { opacity: balanceAnim },
                      ]}
                    >
                      {showBalance ? `₹${userData?.balance || '0.00'}` : 'XXXXX'}
                    </Animated.Text>
                  </View>
                  <TouchableOpacity style={styles.balanceButton} onPress={handleBalanceToggle}>
                    <FontAwesome name={showBalance ? 'eye' : 'eye-slash'} size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.securityBadge}>
                  <FontAwesome name="lock" size={14} color="#FFFFFF" />
                  <Text style={styles.securityBadgeText}>Secured by Bharat Transact</Text>
                </View>
              </View>
            </View>

            <View style={styles.quickActionsBanner}>
              <Text style={styles.bannerTitle}>Quick Actions</Text>
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('SendMoney')}>
                  <View style={styles.actionIconContainer}>
                    <MaterialIcons name="send" size={30} color="white" />
                  </View>
                  <Text style={styles.actionText}>Send Money</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('Scanner')}>
                  <View style={styles.actionIconContainer}>
                    <MaterialIcons name="qr-code-scanner" size={30} color="white" />
                  </View>
                  <Text style={styles.actionText}>Scan QR</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.servicesBanner}>
              <Text style={styles.bannerTitle}>Our Services</Text>
              <View style={styles.servicesGrid}>
                <TouchableOpacity style={styles.serviceItem} onPress={()=>navigation.navigate('BankTransfer')}>
                  <View style={styles.serviceIconContainer}>
                    <MaterialIcons name="account-balance" size={30} color="#1F41B1" />
                  </View>
                  <Text style={styles.serviceText}>Bank Transfer</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={styles.serviceItem} onPress={()=>{navigation.navigate("PayBills")}}>
                  <View style={styles.serviceIconContainer}>
                    <MaterialIcons name="payment" size={30} color="#1F41B1" />
                  </View>
                  <Text style={styles.serviceText}>Pay Bills</Text>
                </TouchableOpacity> */}

                <TouchableOpacity 
                  style={styles.serviceItem}
                  onPress={() => navigation.navigate('RecentTransaction')}
                >
                  <View style={styles.serviceIconContainer} >
                    <MaterialIcons name="history" size={30} color="#1F41B1" />
                  </View>
                  <Text style={styles.serviceText}>Transaction History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.serviceItem} onPress={()=>{navigation.navigate("Support")}}>
                  <View style={styles.serviceIconContainer}>
                    <MaterialIcons name="support-agent" size={30} color="#1F41B1" />
                  </View>
                  <Text style={styles.serviceText}>Support</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.promotionsBanner}>
              <Text style={styles.bannerTitle}>Special Offers</Text>
              <View style={styles.promotionCard}>
                <View style={styles.promotionContent}>
                  <Text style={styles.promotionTitle}>Get 5% Cashback</Text>
                  <Text style={styles.promotionText}>
                    On your first transaction above ₹1000
                  </Text>
                </View>
                <TouchableOpacity style={styles.claimButton}>
                  <Text style={styles.claimButtonText}>Claim Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 1000,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#1F41B1',
  },
  menuButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F41B1',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 65, 177, 0.1)',
  },
  balanceContainer: {
    backgroundColor: '#1F41B1',
    padding: 18,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 10,
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 0,
  },
  balanceButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 20,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(31,65,177,0.08)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  securityBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  quickActionsBanner: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F41B1',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    width: '45%',
  },
  actionIconContainer: {
    backgroundColor: '#1F41B1',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    color: '#1F41B1',
    fontWeight: '500',
  },
  transactionsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  servicesBanner: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceIconContainer: {
    backgroundColor: 'rgba(31, 65, 177, 0.1)',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 14,
    color: '#1F41B1',
    textAlign: 'center',
  },
  promotionsBanner: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  promotionCard: {
    backgroundColor: '#1F41B1',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  promotionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  claimButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  claimButtonText: {
    color: '#1F41B1',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
});

export default NewHome;
