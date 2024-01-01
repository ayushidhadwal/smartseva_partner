import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../constant/Colors';
// import {AntDesign} from '@expo/vector-icons';
import {Button, Divider, Headline} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const FinalAnsScreen = props => {
  return (
    <SafeAreaView style={styles.screen}>
      <Headline style={styles.heading}>Check your anwsers ?</Headline>
      <Text style={styles.subHeading}>
        Once Submitted, you cannot not change your anwser afterwards
      </Text>
      <View style={styles.rowContainer}>
        <View>
          <Text style={styles.question}>
            Q1. How much is your Salary right now ?
          </Text>
          <Text style={styles.answer}>2-4 Years</Text>
        </View>
      </View>
      <Divider />
      <View style={styles.rowContainer}>
        <View>
          <Text style={styles.question}>Q1. What is your age ?</Text>
          <Text style={styles.answer}>18-40 Years</Text>
        </View>
        <AntDesign
          name="edit"
          size={24}
          color={Colors.primary}
          onPress={() => props.navigation.navigate('age')}
        />
      </View>
      <Divider />
      <View style={styles.rowContainer}>
        <View>
          <Text style={styles.question}>
            Q1. How much is your Salary right now ?
          </Text>
          <Text style={styles.answer}>Less than ₹ 5,000</Text>
        </View>
        <AntDesign
          name="edit"
          size={24}
          color={Colors.primary}
          onPress={() => props.navigation.navigate('salary')}
        />
      </View>
      <Divider />
      <Button
        mode="contained"
        style={styles.btn}
        onPress={() => props.navigation.navigate('login')}>
        Continue
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  heading: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  subHeading: {
    color: Colors.grey,
    paddingVertical: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  question: {
    fontSize: 15,
  },
  answer: {
    fontWeight: 'bold',
    padding: 10,
    fontSize: 13,
  },
  btn: {
    width: '60%',
    marginVertical: 40,
    alignSelf: 'center',
  },
});

export default FinalAnsScreen;
