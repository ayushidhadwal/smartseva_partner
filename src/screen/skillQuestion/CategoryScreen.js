import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Headline, Searchbar, RadioButton, Button} from 'react-native-paper';
import Colors from '../../constant/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const CategoryScreen = props => {
  const [value, setValue] = React.useState('');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.section1}>
        <Headline style={styles.heading}>What work you do ?</Headline>
        <Searchbar
          placeholder="Search for Electrician etc ..."
          //   onChangeText={onChangeSearch}
          //   value={searchQuery}
          style={styles.search}
        />
      </View>
      <ScrollView>
        <RadioButton.Group
          onValueChange={value => setValue(value)}
          value={value}>
          <RadioButton.Item
            label="beauty Salon for Women"
            value="first"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Carpenter"
            value="second"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Plumber"
            value="third"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Electrician"
            value="fourth"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Makeup Artist"
            value="fifth"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Message for Men"
            value="sixth"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Skin Hair Consultation"
            value="seventh"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Painter Helper"
            value="eighth"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="AC Repair & Service"
            value="nineth"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Chimney & Hob Repair"
            value="tenth"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Dry Cleaner"
            value="eleventh"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Geyser/Water Heater Repair"
            value="twelveth"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Kitchen Cleaning"
            value="thirteen"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Laundry at Home"
            value="fourteen"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Mens Salon"
            value="fifteen"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Painter"
            value="sixteen"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Pest Control"
            value="seventeen"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Refrigerator Repair"
            value="eighteen"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Women Hair Service"
            value="nineteen"
            color={Colors.primary}
          />
          <RadioButton.Item
            label="Washing Macine Repair"
            value="twenty"
            color={Colors.primary}
          />
        </RadioButton.Group>
      </ScrollView>
      <View style={styles.section1}>
        <Button
          mode="contained"
          style={styles.btn}
          onPress={() => props.navigation.navigate('experience')}>
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  heading: {
    fontWeight: 'bold',
    margin: 15,
  },
  search: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  section1: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
  },
  btn: {
    borderRadius: 15,
    width: '80%',
    alignSelf: 'center',
  },
});

export default CategoryScreen;
