import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import Colors from "../constant/Colors";
import I18n from "../languages/I18n";

const Rating = (props) => {
  const { rating, service, moneyOfValue, behaviour } = props;
  return (
    <View>
      <View style={styles.star}>
        <Text style={{}}>{I18n.t("overallRating")} :</Text>
        <Ionicons
          name="md-star"
          size={15}
          color={rating !== 0 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={rating >= 2 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={rating >= 3 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={rating >= 4 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={rating >= 5 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Text>{I18n.t("serviceRating")} : </Text>
        <Ionicons
          name="md-star"
          size={15}
          color={service !== 0 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={service >= 2 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={service >= 3 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={service >= 4 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={service >= 5 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Text>{I18n.t("valueRating")} : </Text>
        <Ionicons
          name="md-star"
          size={15}
          color={moneyOfValue !== 0 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={moneyOfValue >= 2 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={moneyOfValue >= 3 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={moneyOfValue >= 4 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={moneyOfValue >= 5 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Text>{I18n.t("behaviourRating")} : </Text>
        <Ionicons
          name="md-star"
          size={15}
          color={behaviour !== 0 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={behaviour >= 2 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={behaviour >= 3 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={behaviour >= 4 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={15}
          color={behaviour >= 5 ? Colors.darkYellow : "grey"}
          style={styles.icon}
        />
      </View>
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  star: {
    flexDirection: "row",
    alignItems: 'center'
  },
  icon: { paddingTop: 3 },
});
