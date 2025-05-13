import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { url_api } from '../../impUrl';

const width = Dimensions.get('window').width;
const RecentTransactions = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [balanceAnim] = useState(new Animated.Value(1));
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      const response = await axios.get(`${url_api}/api/user/get-user-by-JWT`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.userDetails) {
        setUserData(response.data.userDetails);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  const fetchTransactions = async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('jwt_token');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      const response = await axios.get(`${url_api}/api/transaction/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.transactions) {
        // Log the transactions to verify the data
        console.log('Fetched transactions:', response.data.transactions);
        const reversedTransactions = response.data.transactions.reverse();
        setTransactions(reversedTransactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
    fetchTransactions();
  };

  const getTransactionIcon = (direction) => {
    switch (direction) {
      case 'incoming':
        return 'arrow-downward';
      case 'outgoing':
        return 'arrow-upward';
      default:
        return 'swap-horiz';
    }
  };

  const getTransactionColor = (direction) => {
    switch (direction) {
      case 'incoming':
        return '#4CAF50';
      case 'outgoing':
        return '#F44336';
      default:
        return '#1F41B1';
    }
  };

  const getTransactionType = (direction) => {
    switch (direction) {
      case 'incoming':
        return 'Received';
      case 'outgoing':
        return 'Sent';
      default:
        return 'Transaction';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const istFormatterDate = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const istFormatterTime = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const istDate = new Date(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      }).formatToParts(date).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {})
    );
    const now = new Date();
    const todayIST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const yesterdayIST = new Date(todayIST);
    yesterdayIST.setDate(todayIST.getDate() - 1);

    const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

    const timeString = istFormatterTime.format(date);
    const dateStringFormatted = istFormatterDate.format(date);

    if (isSameDay(istDate, todayIST)) {
      return `Today at ${timeString}`;
    } else if (isSameDay(istDate, yesterdayIST)) {
      return `Yesterday at ${timeString}`;
    } else {
      return `${dateStringFormatted} at ${timeString}`;
    }
  };


  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      // onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}
    >
      <View style={[styles.transactionIcon, { backgroundColor: `${getTransactionColor(item.direction)}15` }]}>
        <MaterialIcons 
          name={getTransactionIcon(item.direction)} 
          size={24} 
          color={getTransactionColor(item.direction)} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>
          {getTransactionType(item.direction)}
        </Text>
        <Text style={styles.transactionDate}>Transaction Id: {item.transactionId}</Text>
        {item.direction === 'incoming' ? (
          <Text style={styles.transactionDate}>From: {item.fromUser.firstName} {item.fromUser.lastName}</Text>
        ) : (
          <Text style={styles.transactionDate}>To: {item.toUser.firstName} {item.toUser.lastName}</Text>
        )}
        <Text style={styles.transactionDate}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[
          styles.transactionAmount,
          { color: getTransactionColor(item.direction) }
        ]}>
          {item.prefix}₹{item.amount}
        </Text>
        <MaterialIcons name="chevron-right" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F41B1" />
      </View>
    );
  }

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
          <Text style={styles.headerTitle}>Transaction History</Text>
          <View style={styles.backButton} />
        </View>
      </LinearGradient>

  
  
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
                ₹{userData?.balance}
              </Animated.Text>
            </View>
          </View>
          <View style={styles.securityBadge}>
            <FontAwesome name="lock" size={14} color="#FFFFFF" />
            <Text style={styles.securityBadgeText}>Secured by Bharat Transact</Text>
          </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={50} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchTransactions}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#1F41B1']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="history" size={50} color="#1F41B1" />
              <Text style={styles.emptyText}>No transactions found</Text>
              <Text style={styles.emptySubText}>Your transaction history will appear here</Text>
            </View>
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: '#666',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F41B1',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1F41B1',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  balanceCardWrapper: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    margin: 20,
    marginBottom: 10,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F41B1',
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
    width: width * 0.9,
    alignSelf: 'center',
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
});

export default RecentTransactions;
