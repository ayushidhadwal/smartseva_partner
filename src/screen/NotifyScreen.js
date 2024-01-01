import React from "react";
import { StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constant/Colors";
import I18n from "../languages/I18n";
import RFValue from "../../rfvalue";

const NotifyScreen = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <Image
        source={{
          uri: "https://image.flaticon.com/icons/png/512/4213/4213459.png",
        }}
        style={styles.img}
      />
      <Text style={styles.subHeading}>{I18n.t("alertScreenMsg")}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(10),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: RFValue(100),
    height: RFValue(100),
  },
  subHeading: {
    color: Colors.grey,
    paddingVertical: RFValue(15),
    fontSize: RFValue(15),
  },
});

export default NotifyScreen;
