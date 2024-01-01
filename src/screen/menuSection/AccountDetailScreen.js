import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {Card, Divider} from 'react-native-paper';
import Colors from '../../constant/Colors';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';

const AccountDetailScreen = props => {
  return (
    <View style={styles.screen}>
      <Card style={styles.cardContainer}>
        <Text style={styles.heading}>{I18n.t('tradeLic')}</Text>
        <Divider />
        <Pressable onPress={() => props.navigation.navigate('trade')}>
          <Text style={styles.subHeading}>{I18n.t('addDetails')}</Text>
        </Pressable>
      </Card>

      <Card style={styles.cardContainer}>
        <Text style={styles.heading}>{I18n.t('taxReg')}</Text>
        <Divider />
        <Pressable onPress={() => props.navigation.navigate('TXN')}>
          <Text style={styles.subHeading}>{I18n.t('addDetails')}</Text>
        </Pressable>
      </Card>
      <Card style={styles.cardContainer}>
        <Text style={styles.heading}>{I18n.t('bankAcc')}</Text>
        <Divider />
        <Pressable onPress={() => props.navigation.navigate('Bank')}>
          <Text style={styles.subHeading}>{I18n.t('addDetails')}</Text>
        </Pressable>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(15),
  },
  cardContainer: {
    padding: RFValue(10),
    marginBottom: RFValue(10),
  },
  heading: {
    color: Colors.black,
    fontSize: RFValue(15),
    paddingBottom: RFValue(10),
    fontWeight: 'bold',
  },
  subHeading: {
    color: Colors.primary,
    fontSize: RFValue(15),
    paddingTop: RFValue(10),
  },
});

export default AccountDetailScreen;
