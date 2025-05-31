import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from'../Login/Login';
import SignUp from '../SignUp/SignUp';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import PhoneVerifyOtp from '../SignUp/PhoneVerify'
import NewHome from '../Home/NewHome'
import OpenAppLoading from '../Home/OpenAppLoading'
import SendMoney from '../Transaction/SendMoney';
import CheckBalance from '../Transaction/checkBalance';
import RecentTransactions from '../Transaction/RecentTransactions'
import ForgetPasswordVerifyOtp from '../ForgotPassword/ForgotPasswordVerifyOtp'
import Scanner from '../Transaction/Scanner';
import Sidebar from '../Sidebar/sidebar';
import ScannedSendMoney from '../Transaction/ScannedSendMoney';
import Mpin from '../Transaction/Mpin';
import TransactionSuccessfull from '../Transaction/TransactionSuccessfull';
import BankTransfer from '../bankTransfer/BankTransfer';
import PayBills from '../payBills/PayBills';
import BillPaymentForm from '../payBills/BillPaymentForm';
import Support from '../support/Support';
import MpinCreate from '../Transaction/MpinCreate';
import UserDetails from '../UserDetail/UserDetails';

const Stack = createStackNavigator();


const commonScreenOptions = {
  headerShown: false,
  gestureEnabled: false,
};

// Auth stack screens (Login, SignUp, etc.)
const authScreens = {
  Login: { ...commonScreenOptions },
  SignUp: { ...commonScreenOptions },
  ForgotPassword: { ...commonScreenOptions },
  PhoneVerifyOtp: { ...commonScreenOptions },
  ForgetPasswordVerifyOtp: { ...commonScreenOptions },
};

// Main app screens (Home, Transactions, etc.)
const mainScreens = {
  Home: { ...commonScreenOptions },
  SendMoney: { ...commonScreenOptions },
  CheckBalance: { ...commonScreenOptions },
  RecentTransaction: { ...commonScreenOptions },
  Scanner: { ...commonScreenOptions },
  Sidebar: { ...commonScreenOptions },
  ScannedSendMoney: { ...commonScreenOptions },
  Mpin: { ...commonScreenOptions },
  TransactionSuccessfull: { ...commonScreenOptions },
  BankTransfer: { ...commonScreenOptions },
  PayBills: { ...commonScreenOptions },
  BillPaymentForm: { ...commonScreenOptions },
  Support: { ...commonScreenOptions },
  MpinCreate: { ...commonScreenOptions },
  UserDetails: { ...commonScreenOptions },
};

export default function Navigation() {
  return (
    <Stack.Navigator 
      initialRouteName="OpenAppLoading"
      screenOptions={{
        ...commonScreenOptions,
        animationEnabled: true,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen 
        name="OpenAppLoading" 
        component={OpenAppLoading} 
        options={{ ...commonScreenOptions, gestureEnabled: false }}
      />
      
      {/* Auth Stack */}
      <Stack.Screen name="Login" component={Login} options={authScreens.Login} />
      <Stack.Screen name="SignUp" component={SignUp} options={authScreens.SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={authScreens.ForgotPassword} />
      <Stack.Screen name="PhoneVerifyOtp" component={PhoneVerifyOtp} options={authScreens.PhoneVerifyOtp} />
      <Stack.Screen name="ForgetPasswordVerifyOtp" component={ForgetPasswordVerifyOtp} options={authScreens.ForgetPasswordVerifyOtp} />
      
      {/* Main App Stack */}
      <Stack.Screen name="Home" component={NewHome} options={mainScreens.Home} />
      <Stack.Screen name="SendMoney" component={SendMoney} options={mainScreens.SendMoney} />
      <Stack.Screen name="CheckBalance" component={CheckBalance} options={mainScreens.CheckBalance} />
      <Stack.Screen name="RecentTransaction" component={RecentTransactions} options={mainScreens.RecentTransaction} />
      <Stack.Screen name="Scanner" component={Scanner} options={mainScreens.Scanner} />
      <Stack.Screen name="Sidebar" component={Sidebar} options={mainScreens.Sidebar} />
      <Stack.Screen name="ScannedSendMoney" component={ScannedSendMoney} options={mainScreens.ScannedSendMoney} />
      <Stack.Screen name="Mpin" component={Mpin} options={mainScreens.Mpin} />
      <Stack.Screen name="TransactionSuccessfull" component={TransactionSuccessfull} options={mainScreens.TransactionSuccessfull} />
      <Stack.Screen name="BankTransfer" component={BankTransfer} options={mainScreens.BankTransfer} />
      <Stack.Screen name="PayBills" component={PayBills} options={mainScreens.PayBills} />
      <Stack.Screen name="BillPaymentForm" component={BillPaymentForm} options={mainScreens.BillPaymentForm} />
      <Stack.Screen name="Support" component={Support} options={mainScreens.Support} />
      <Stack.Screen name="MpinCreate" component={MpinCreate} options={mainScreens.MpinCreate} />
      <Stack.Screen name="UserDetails" component={UserDetails} options={mainScreens.UserDetails} />
    </Stack.Navigator>
  );
}
