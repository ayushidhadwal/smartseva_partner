import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Headline, RadioButton, Button, Divider } from "react-native-paper";
import Colors from "../../constant/Colors";
import {SafeAreaView} from "react-native-safe-area-context";

const ExperienceScreen = (props) => {
  const [value, setValue] = React.useState("");

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={{ color: Colors.grey, padding: 15 }}>
        Question: 2/3
      </Text>
      <Headline style={styles.heading}>What is your age ?</Headline>
      <ScrollView>
        <RadioButton.Group
          onValueChange={(value) => setValue(value)}
          value={value}
        >
          <RadioButton.Item
            label="Less than 18 years"
            value="first"
            color={Colors.primary}
          />
          <Divider />
          <RadioButton.Item
            label="18-40 Years"
            value="second"
            color={Colors.primary}
          />
          <Divider />
          <RadioButton.Item
            label="More Than 40 Years"
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
          onPress={() => props.navigation.navigate("salary")}
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

export default ExperienceScreen;
