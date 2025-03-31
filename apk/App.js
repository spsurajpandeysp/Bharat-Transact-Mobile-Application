import { StyleSheet,StatusBar } from "react-native";
import React from "react";

import Navigation from './components/Navigation/Navigation'
import Mpin from './components/Transaction/Mpin'
const App = () => {
  return (
    <>
        <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
    <Navigation/>
    {/* <Mpin></Mpin> */}
    </>
  );
};

export default App;

const styles = StyleSheet.create({});