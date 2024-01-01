import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Headline, RadioButton, Button, Divider } from "react-native-paper";
import Colors from "../../constant/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const SalaryScreen = (props) => {
  const [value, setValue] = React.useState("");

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={{ color: Colors.grey, padding: 15 }}>
        Question: 3/3
      </Text>
      <Headline style={styles.heading}>
        How much is your Salary right now? ?
      </Headline>
      <ScrollView>
        <RadioButton.Group
          onValueChange={(value) => setValue(value)}
          value={value}
        >
          <RadioButton.Item
            label="Less than ₹ 5,000"
            value="first"
            color={Colors.primary}
          />
          <Divider />
          <RadioButton.Item
            label="₹ 5,000 - ₹ 10,000"
            value="second"
            color={Colors.primary}
          />
          <Divider />
          <RadioButton.Item
            label="More Than ₹ 10,000"
            value="third"
            color={Colors.primary}
          />
          <Divider />
        </RadioButton.Group>
      </ScrollView>
      <View style={styles.section1}>
        <Button
          mode="contained"
          style={styles.btn}
          onPress={() => props.navigation.navigate("final")}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10,
  },
  heading: {
    fontWeight: "bold",
    margin: 15,
  },
  section1: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  btn: {
    borderRadius: 15,
    width: "60%",
    alignSelf: "flex-end",
  },
});

export default SalaryScreen;
