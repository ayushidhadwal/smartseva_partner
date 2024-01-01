import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Divider, Title} from 'react-native-paper';
import {Row, Rows, Table} from 'react-native-table-component';

import * as requestAction from '../store/actions/request';
import * as userActions from '../store/actions/user';
import Colors from '../constant/Colors';
import I18n from '../languages/I18n';
import RFValue from '../../rfvalue';

const InvoiceScreen = props => {
  const {booking_id} = props.route.params;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = props.navigation;
  const dispatch = useDispatch();
  const {getDetailsOfBooking} = useSelector(state => state.request);

  const tableHead = ['Service', `Total Price`];
  const tableData = getDetailsOfBooking.serviceDetails.map(m => [
    m.child_cat === null
      ? `${m.subcategory_name}`
      : `${m.subcategory_name} - ${m.child_cat}`,
    '₹  ' + m.st_service_price.toFixed(2),
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.set_Profile());
        await dispatch(requestAction.getBookingDetails(booking_id));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      <Title style={styles.title}>
        {I18n.t('invoiceNo')} : #
        {getDetailsOfBooking.booking_details.booking_id}
      </Title>
      <View style={styles.card}>
        <Text
          style={{
            fontWeight: 'bold',
            color: Colors.black,
          }}>
          SMARTSEVA
          {/*{getDetailsOfBooking.setting.application_name}*/}
        </Text>
        <Text>{getDetailsOfBooking.setting.address}</Text>
      </View>
      <View style={[styles.card, {marginVertical: RFValue(10)}]}>
        <Text style={[styles.bold, {fontSize: RFValue(13)}]}>
          {I18n.t('serviceDesc')} :
        </Text>
        <Divider style={styles.marginVertical} />
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.text} />

          <Row
            data={[
              getDetailsOfBooking.booking_details.job_completed_comment,
              getDetailsOfBooking.booking_details.additional_price,
            ]}
            textStyle={styles.text}
          />
          <Row
            data={[`Convenience Fee`, `+ ₹${getDetailsOfBooking.gst_amount}`]}
            textStyle={styles.text}
          />
          <Row
            data={['Total Amount', `₹${getDetailsOfBooking.totalAmount}`]}
            style={[styles.head]}
            textStyle={[styles.text]}
          />
        </Table>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    color: Colors.primary,
    textAlign: 'center',
    paddingVertical: RFValue(10),
  },
  marginVertical: {
    marginVertical: RFValue(8),
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    padding: RFValue(12),
    backgroundColor: 'white',
  },
  head: {backgroundColor: '#f1f8ff'},
  text: {margin: 6, fontSize: RFValue(11), textAlign: 'center'},
  row: {height: 28},
  providerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default InvoiceScreen;
