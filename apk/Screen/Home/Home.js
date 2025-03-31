import React from 'react';
import { Animated,ScrollView, ImageBackground, View, Text, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './styles';
import { useState,useRef,useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
// import { ScrollView } from 'react-native-gesture-handler';

const Home = () => {
    const screenWidth = Dimensions.get('window').width;
    const paymentListData = [
        { label: 'Internet', iconName: 'wifi', iconSet: 'MaterialIcons', color: '#FF3B30' },
        { label: 'Electricity', iconName: 'bolt', iconSet: 'FontAwesome5', color: '#FF9500' },
        { label: 'Voucher', iconName: 'gift', iconSet: 'FontAwesome5', color: '#30D158' },
        { label: 'Assurance', iconName: 'medical-services', iconSet: 'MaterialIcons', color: '#0A84FF' },
        { label: 'Mobile Credit', iconName: 'mobile-alt', iconSet: 'FontAwesome5', color: '#AF52DE' },
        { label: 'Bill', iconName: 'file-invoice-dollar', iconSet: 'FontAwesome5', color: '#5E5CE6' },
        { label: 'Merchant', iconName: 'shopping-cart', iconSet: 'FontAwesome5', color: '#E83E8C' },
        { label: 'More', iconName: 'apps', iconSet: 'MaterialIcons', color: '#5E5CE6' },
    ];
    const [startX, setStartX] = useState(0);
    const [showPromo, setShowPromo] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000, // 2 seconds
          useNativeDriver: true, // Optimized for performance
        }).start();
      }, []);

    const handleTouchStart = (e) => {
        setStartX(e.nativeEvent.pageX);
    };

    const handleTouchEnd = (e) => {
        const endX = e.nativeEvent.pageX;
        const diff = endX - startX;

        if (diff > 50) {
            console.log('Swiped Right');
            if(showPromo === promoData.length - 1){
                setShowPromo(0);
            }
            else{
                setShowPromo(showPromo + 1);
            }
         
        } else if (diff < -50) {
            console.log('Swiped Left');
            if(showPromo === 0){
                setShowPromo(promoData.length - 1);
            }
            else{
                setShowPromo(showPromo - 1);
            }
        }
    };

    const promoData = [
        { heading: "Hello What Help You Need", desc: "Hello What Help You Need Hello", backgroundImage: "https://img.freepik.com/premium-photo/psychedelic-abstract-gradient-backgrounds-pattern-purple_53876-187183.jpg" },
        { heading: "Top Discount Available in our app", desc: "Simple you need to apply coupon", backgroundImage: "https://static.vecteezy.com/system/resources/thumbnails/007/523/322/small/fresh-abstract-banner-background-with-text-space-vector.jpg" },
        { heading: "Refer to your friend", desc: "User email id to refer to your friend", backgroundImage: "https://www.shutterstock.com/image-photo/fresh-red-apples-on-wooden-600nw-2503264777.jpg" },
    ]


    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <LinearGradient
                colors={['#3E1E68', '#8B33D7']}
                style={styles.container}
            >

                {/* <LinearGradient colors={['#4C00FF', '#8A00FF']} style={styles.gradient}> */}
                <View style={styles.balanceView}>
                    <Text style={styles.balanceText}>Balance</Text>
                    <Text style={styles.balanceAmount}>$1000</Text>
                    <Icon size={30} color="black" />
                    <Icon size={30} color="black" />
                    <Icon size={30} color="black" />
                </View>
                <View style={styles.otherViews}>
                    <View style={styles.featuresView}>

                        <View style={styles.feature}>
                            <MaterialIcons name="history" size={24} color="#6419d4" />


                            <Text >History</Text>
                        </View>
                        <View style={styles.feature}>
                            <MaterialIcons name="history" size={24} color="#6419d4" />


                            <Text >History</Text>
                        </View>
                        <View style={styles.feature}>
                            <MaterialIcons name="history" size={24} color="#6419d4" />


                            <Text >History</Text>
                        </View>
                        <View style={styles.feature}>
                            <MaterialIcons name="history" size={24} color="#6419d4" />


                            <Text >History</Text>
                        </View>

                    </View>
                    <View style={styles.paymentListView}>

                        <Text style={styles.heading}>Payment List</Text>
                        <View style={styles.paymentList}>
                            {paymentListData.map((item, index) => ( // Access index here
                                <View style={styles.paymentItem}>
                                    <View style={styles.paymentIconView}>

                                        <Icon style={styles.paymentIcon} name={item.iconName} size={30} color={item.color} />
                                    </View>
                                    <Text>{item.label}</Text>
                                </View>
                            ))}
                        </View>

                    </View>
                    <View style={styles.promoView}>
                        <Text style={styles.heading}>Promo</Text>
                        <Animated.View onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            style={styles.promoItem}>
                            <ImageBackground
                                source={{ uri: promoData[showPromo].backgroundImage }} // Path to your image
                                style={styles.backgroundImage}
                                resizeMode="cover" // Options: cover, contain, stretch, center, repeat
                            >
                                <View style={styles.overlay}>
                                    <Text style={styles.text}>{promoData[showPromo].heading}</Text>
                                    <Text style={styles.desc}>{promoData[showPromo].desc}</Text>
                                </View>
                            </ImageBackground>


                            <View style={styles.promoNav}>
                                {promoData.map((item, index) => (
                                    <View style={[showPromo === index ? styles.promoNavActive : null, styles.promoNavItem]}>

                                    </View>
                                ))}


                            </View>

                        </Animated.View>

                    </View>


                </View>
                {/* </LinearGradient> */}
            </LinearGradient>
        </ScrollView>
    );
};

export default Home;