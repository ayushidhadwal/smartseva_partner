import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { Button, Card, Divider, Title } from "react-native-paper";
import Colors from "../../constant/Colors";
import MapView, { Marker } from "react-native-maps";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import RFValue from "../../../rfvalue";

const AroundUsScreen = (props) => {
  return (
    <SafeAreaView style={styles.screen}>
      {/* <Header {...props} /> */}
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />
      <Text style={styles.title}>Around Us Screen</Text>
      <Card style={styles.cardContainer}>
        <View style={styles.cardSection}>
          <View>
            <Title style={styles.cardTitle}>Today's jobs around you</Title>
            <View style={styles.row1}>
              <MaterialCommunityIcons
                name="bag-checked"
                size={24}
                color={Colors.grey}
              />
              <Text style={styles.text1}>3 jobs</Text>
            </View>
            <View style={styles.row1}>
              <FontAwesome5
                name="money-bill-wave"
                size={20}
                color={Colors.grey}
              />
              <Text style={styles.text1}>Worth ₹ 12985</Text>
            </View>
          </View>
          <Image
            source={{
              uri: "https://www.just.edu.jo/Units_and_offices/Offices/IRO/PublishingImages/Pages/aboutJordan/giphy.gif",
            }}
            style={styles.gif}
          />
        </View>
        <Divider />
        <Text style={styles.update}>Last Updated at 12 pm</Text>
      </Card>
      <Button
        mode="contained"
        style={styles.exploreBtn}
        contentStyle={{ height: 50 }}
        icon="map-search-outline"
      >
        Explore on Map
      </Button>
      <MapView
        initialRegion={{
          latitude: 28.465069546676897,
          longitude: 77.01261520385742,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.mapStyle}
      >
        <Marker
          coordinate={{
            latitude: 28.465069546676897,
            longitude: 77.01261520385742,
          }}
          image={require("../../assets/marker.png")}
          title={"₹ 1368"}
        />
      </MapView>
      <View style={{ paddingVertical: RFValue(10) }}>
        <Text style={{ fontSize: RFValue(17) }}>
          <Text style={{ fontWeight: "bold" }}>See your friends </Text>working
          with us
        </Text>
        <Text style={{ color: Colors.grey, paddingBottom: RFValue(8) }}>
          Give contact access to see your friends
        </Text>
        <Button
          mode="contained"
          icon="account-multiple"
          style={styles.showBtn}
          contentStyle={{ height: 45 }}
        >
          Show my friends
        </Button>
      </View>
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{ flexDirection: "row-reverse", height: 50 }}
        icon="phone"
        onPress={() => props.navigation.navigate("help")}
      >
        Help
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(10),
    backgroundColor: Colors.white,
  },
  mapStyle: {
    width: widthPercentageToDP("100%"),
    height: heightPercentageToDP("60%"),
  },
  heading: {
    fontWeight: "bold",
  },
  subHeading: {
    textAlign: "center",
    fontSize: RFValue(16),
    paddingTop: RFValue(250),
  },
  btn: {
    width: "30%",
    borderRadius: RFValue(20),
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  title: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    paddingVertical: RFValue(8),
  },
  cardContainer: {
    padding: RFValue(10),
    width: widthPercentageToDP("90%"),
    borderRadius: RFValue(10),
    position: "absolute",
    backgroundColor: Colors.white,
    top: 90,
    left: 20,
  },
  cardSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: RFValue(10),
  },
  cardTitle: {
    color: Colors.primary,
  },
  row1: {
    flexDirection: "row",
  },
  text1: {
    paddingLeft: RFValue(8),
    fontWeight: "bold",
  },
  gif: {
    width: RFValue(80),
    height: RFValue(80),
  },
  update: {
    color: Colors.blue,
    paddingTop: RFValue(10),
    fontSize: RFValue(13),
  },
  exploreBtn: {
    width: "55%",
    borderRadius: RFValue(30),
    alignSelf: "center",
    position: "absolute",
    bottom: 200,
  },
  showBtn: {
    width: "55%",
    borderRadius: RFValue(30),
  },
});

export default AroundUsScreen;
