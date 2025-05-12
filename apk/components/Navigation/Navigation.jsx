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
const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="OpenAppLoading">
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <Stack.Screen name="PhoneVerifyOtp" component={PhoneVerifyOtp} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={NewHome} options={{headerShown: false}} />
      <Stack.Screen name="OpenAppLoading" component={OpenAppLoading} options={{headerShown: false}} />
      <Stack.Screen name="SendMoney" component={SendMoney} options={{headerShown: false}} />
      <Stack.Screen name="CheckBalance" component={CheckBalance} options={{headerShown: false}} />
      <Stack.Screen name="RecentTransaction" component={RecentTransactions} options={{headerShown: false}} />
      <Stack.Screen name="ForgetPasswordVerifyOtp" component={ForgetPasswordVerifyOtp} options={{headerShown: false}} />
      <Stack.Screen name="Scanner" component={Scanner} options={{headerShown: false}} />
      <Stack.Screen name="Sidebar" component={Sidebar} options={{headerShown: false}} />
      <Stack.Screen name="ScannedSendMoney" component={ScannedSendMoney} options={{headerShown: false}} />
      <Stack.Screen name="Mpin" component={Mpin} options={{headerShown: false}} />
      <Stack.Screen name="TransactionSuccessfull" component={TransactionSuccessfull} options={{headerShown: false}} />
      <Stack.Screen name="BankTransfer" component={BankTransfer} options={{headerShown: false}} />
      <Stack.Screen name="PayBills" component={PayBills} options={{headerShown: false}} />
      <Stack.Screen name='BillPaymentForm' component={BillPaymentForm} options={{headerShown:false}}/>
      <Stack.Screen name='Support' component={Support} options={{headerShown:false}}/>
      
    </Stack.Navigator>
  );
}
