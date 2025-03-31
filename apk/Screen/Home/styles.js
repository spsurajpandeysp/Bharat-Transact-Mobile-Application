import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: "pink",

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    promoView: {
        flex: 1
    },
    paymentListView: {
        flex: 1,
        width: '94%',
        alignSelf: "center",
        // backgroundColor: 'red',
    },
    heading: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    featuresView: {
        // paddingTop: 30,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#fff",
        width: '90%',
        // backgroundColor: 'red',
        elevation: 10,
        margin: "auto",
        paddingVertical: 10,
        position: "relative",
        margin: "auto",
        top: -30,

        borderRadius: 20,
    },
    gradient: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    balanceView: {
        background: "transparent",
        flex: 0.6,
    },
    balanceText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    balanceAmount: {
        fontSize: 20,
        color: 'green',
    },
    otherViews: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    feature: {
        alignItems: "center",
        flex: 1,
        gap: 5,
        width: "max-content",


    },
    paymentList: {

        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        // backgroundColor:"purple",
        paddingHorizontal: 10,
        paddingVertical: 20,
        justifyContent: "space-between"
    },
    scrollView: {
        width: "100%",
        backgroundColor: "red",
    },
    paymentItem: {
        padding: 0,
        alignItems: "center",
        gap: 10,
        width: "25%",
        paddingVertical: 10,
        // backgroundColor:"yellow",
        padding: 10,
        // width:"50%",
        // flex:1,
    },
    paymentIconView: {
        backgroundColor: "#F0F0F0",
        width: "70%",
        aspectRatio: 1, // Perfect square
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        // Use a fixed value instead of "auto"
        elevation: 5, // Uncomment if needed for shadow
    },
    backgroundImage: {

        flex: 1,
        backgroundColor: "black"
    },
    promoItem: {
        // width: "100%",
        flex: 1,
        height: 200,
        backgroundColor: "red",
        borderRadius: 20,
        overflow: "hidden",
        // elevation: 10,
        marginTop: 10,
        margin:10,
    },
    promoText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        position: "absolute",
        bottom: 10,
        left: 10,
    },
    promoView: {
        margin:"auto",
        width: "94%",
        flex: 1,
    },
    promoNavItem:{
        backgroundColor: "white",
        width: 10,
        height: 10,
        borderColor:"gray",
        borderWidth:1,
        borderRadius:"100%"
    },
    promoNav:{
        display:"flex",
        flexDirection:"row",
        gap:5,
      
        justifyContent:"center",
        marginTop:10,
   
    },
    promoNavActive:{

        backgroundColor:"gray",
     
    }


});

export default styles;