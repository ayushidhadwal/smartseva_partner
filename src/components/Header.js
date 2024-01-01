import React from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constant/Colors";

const Header = (props) => {
  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        backgroundColor={Colors.primary}
      />
      <View style={styles.headerSection}>
        <Ionicons
          name="md-notifications"
          size={26}
          color="black"
          style={styles.icon}
          onPress={() => props.navigation.navigate("notify")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  icon: {
    paddingRight: 10,
  },
});

export default Header;
