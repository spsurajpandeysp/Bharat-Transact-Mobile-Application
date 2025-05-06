import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from'../Login/Login';
import SignUp from '../SignUp/SignUp';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import EmailVerifyOtp from '../SignUp/EmailVerify'
import NewHome from '../Home/NewHome'
import OpenAppLoading from '../Home/OpenAppLoading'
import SendMoney from '../Transaction/SendMoney';
import CheckBalance from '../Transaction/checkBalance';
import RecentTransactions from '../Transaction/RecentTransactions'
import ForgetPasswordVerifyOtp from '../ForgotPassword/ForgotPasswordVerifyOtp'
import Scanner from '../Transaction/Scanner';
import Sidebar from '../Sidebar/sidebar';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="OpenAppLoading">
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      <Stack.Screen name="EmailVerifyOtp" component={EmailVerifyOtp} options={{headerShown: false}} />
      <Stack.Screen name="Home" component={NewHome} options={{headerShown: false}} />
      <Stack.Screen name="OpenAppLoading" component={OpenAppLoading} options={{headerShown: false}} />
      <Stack.Screen name="SendMoney" component={SendMoney} options={{headerShown: false}} />
      <Stack.Screen name="CheckBalance" component={CheckBalance} options={{headerShown: false}} />
      <Stack.Screen name="RecentTransaction" component={RecentTransactions} options={{headerShown: false}} />
      <Stack.Screen name="ForgetPasswordVerifyOtp" component={ForgetPasswordVerifyOtp} options={{headerShown: false}} />
      <Stack.Screen name="Scanner" component={Scanner} options={{headerShown: false}} />
      <Stack.Screen name="Sidebar" component={Sidebar} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}
