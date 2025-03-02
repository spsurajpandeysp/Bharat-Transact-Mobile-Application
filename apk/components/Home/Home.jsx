// import React from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
// import AntDesign from "react-native-vector-icons/AntDesign";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// const Home = ({navigation}) => {
//   const logout = async () => {
//     try {
//       await AsyncStorage.removeItem('jwt_token');
//       navigation.replace('OpenAppLoading'); 
//     } catch (error) {
//       console.error('Error during logout:', error);
//       alert('An error occurred while logging out. Please try again.');
//     }
//   };
//   return (
//     <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.logoContainer}>
//             {/* <Image
//               source={require("./images/logo.png")} 
//               style={styles.logo}
//             /> */}
//             <Text style={styles.appName}>Bharat Transact</Text>
//           </View>

//           {/* Bell Icon */}
//           <TouchableOpacity style={styles.bellIcon} onPress={logout}>
//             <AntDesign name="bells" size={25} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       <ScrollView contentContainerStyle={styles.scrollContent}>

//         {/* Money Transfer Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>MONEY TRANSFER</Text>
//           <View style={styles.iconGrid}>
//             <TouchableOpacity  style={styles.iconButton}>
//               <AntDesign name="scan1" size={30} color="#4caf50" />
//               <Text style={styles.iconText}>Scan & Pay</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={()=>navigation.navigate("SendMoney")} style={styles.iconButton}>
//               <AntDesign name="mobile1" size={30} color="#4caf50" />
//               <Text style={styles.iconText}>Send Money to Accout</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <AntDesign name="bank" size={30} color="#4caf50" />
//               <Text style={styles.iconText}>To Bank A/c</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <AntDesign name="user" size={30} color="#4caf50" />
//               <Text style={styles.iconText}>To Self A/c</Text>
//             </TouchableOpacity>
//             {/* Check Balance Button */}
//             <TouchableOpacity style={styles.iconButton} onPress={()=>navigation.navigate('CheckBalance')}>
//               <AntDesign name="creditcard" size={30} color="#4caf50" />
//               <Text style={styles.iconText}>Check Balance</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Bill Payments Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>BILL PAYMENTS BY BBPS</Text>
//           <View style={styles.iconGrid}>
//             <TouchableOpacity style={styles.iconButton}>
//               <AntDesign name="mobile1" size={30} color="#ff9800" />
//               <Text style={styles.iconText}>Mobile Recharge</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <AntDesign name="bulb1" size={30} color="#ff9800" />
//               <Text style={styles.iconText}>Electricity Bill</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <AntDesign name="rest" size={30} color="#ff9800" />
//               <Text style={styles.iconText}>Gas Booking</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <AntDesign name="phone" size={30} color="#ff9800" />
//               <Text style={styles.iconText}>DTH Recharge</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* History Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>TRANSACTION HISTORY</Text>
//           <View style={styles.iconGrid}>
//             <TouchableOpacity style={styles.iconButton}>
//               <AntDesign name="clockcircleo" size={30} color="#3f51b5" />
//               <Text style={styles.iconText}>Recent Transfers</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton}>
//               <AntDesign name="contacts" size={30} color="#3f51b5" />
//               <Text style={styles.iconText}>Past Payments</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton} onPress={()=>navigation.navigate("RecentTransaction")}>
//               <AntDesign name="filetext1" size={30} color="#3f51b5" />
//               <Text style={styles.iconText}>Transaction Details</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Footer */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate("Home")}>
//           <AntDesign name="home" size={20} color="#fff" />
//           <Text style={styles.footerText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerButton}>
//           <AntDesign name="contacts" size={20} color="#fff" />
//           <Text style={styles.footerText}>Contact Us</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.footerButton}>
//           <AntDesign name="wechat" size={20} color="#fff" />
//           <Text style={styles.footerText}>Chat Bot</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: "relative", 
//   },

//   scrollContent: {
//     paddingBottom: 70,
//   },

//   header: {
//     backgroundColor: "#3813C2CC",
//     paddingVertical: 15,
//     flexDirection: "row",
//     justifyContent: "space-between", 
//     alignItems: "center", 
//     marginBottom: 30,
//     marginTop:25
//   },
//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     marginRight: 10,
//     borderRadius:50
//   },
//   appName: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   bellIcon: {
//     marginRight: 15, 
//   },
//   section: {
//     paddingHorizontal: 20,
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 10,
//   },
//   iconGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between", 
//   },
//   iconButton: {
//     alignItems: "center",
//     width: "22%", 
//     marginBottom: 20,
//   },
//   iconText: {
//     fontSize: 12,
//     color: "#333",
//     marginTop: 5,
//     textAlign: "center",
//   },
//   footer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "#004aad",
//     paddingVertical: 10, 
//   },
//   footerButton: {
//     alignItems: "center",
//   },
//   footerText: {
//     color: "#fff",
//     fontSize: 12,
//     marginTop: 5,
//   },
// });