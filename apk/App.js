import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Navigation from './components/Navigation/Navigation'
import Mpin from './components/Transaction/Mpin'
import RecentTransactions from './components/Transaction/RecentTransactions';
import EnterAmount from './components/Transaction/EnterAmount';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Navigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecentTransactions"
          component={RecentTransactions}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Mpin"
          component={Mpin}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EnterAmount"
          component={EnterAmount}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});