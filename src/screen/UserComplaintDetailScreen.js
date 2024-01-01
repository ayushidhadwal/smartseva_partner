import dayjs from 'dayjs';
import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import {Row, Rows, Table} from 'react-native-table-component';
import Colors from '../constant/Colors';
import * as requestAction from '../store/actions/request';
import I18n from '../languages/I18n';
import RFValue from '../../rfvalue';

const TextRow = ({heading, text, color}) => (
  <Text style={styles.headingStyles}>
    {heading}:{' '}
    <Text style={{fontWeight: 'normal', color: color ? color : 'black'}}>
      {text}
    </Text>
  </Text>
);

const UserComplaintDetailScreen = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const {booking_id} = props.route.params;

  const {getDetailsOfBooking} = useSelector(state => state.request);

  const navigation = props.navigation;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getBookingDetails(booking_id));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [booking_id, dispatch, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const tableHead = [I18n.t('serviceTable'), I18n.t('totalTable')];

  const tableData = getDetailsOfBooking.serviceDetails.map(m => [
    m.child_cat === null
      ? `${m.subcategory_name}`
      : `${m.subcategory_name} - ${m.child_cat}`,
    '₹' + m.st_service_price,
  ]);

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text
        style={[
          styles.headingStyles,
          {
            fontSize: RFValue(18),
            textAlign: 'center',
            marginBottom: RFValue(10),
          },
        ]}>
        {I18n.t('statusScreen')}
      </Text>
      <View style={styles.cardContainer1}>
        <TextRow heading={I18n.t('statusBookId')} text={booking_id} />
        <TextRow
          heading={'Service Name'}
          text={getDetailsOfBooking.booking_details.service_name}
        />
        <TextRow
          heading={I18n.t('statusBookDate')}
          text={dayjs(getDetailsOfBooking.booking_details.booking_date).format(
            'DD MMM YYYY',
          )}
        />
        <TextRow
          heading={I18n.t('statusBookTime')}
          text={dayjs(
            `${getDetailsOfBooking.booking_details.booking_date} ${getDetailsOfBooking.booking_details.booking_time}`,
          ).format('hh:mm a')}
        />
        <TextRow
          heading={I18n.t('statusCustName')}
          text={getDetailsOfBooking.booking_details.user_name}
        />

        <TextRow
          heading={I18n.t('statusType')}
          text={getDetailsOfBooking.booking_details.status}
          color={
            getDetailsOfBooking.booking_details.status === 'ACCEPTED' ||
            getDetailsOfBooking.booking_details.status === 'COMPLETED'
              ? 'green'
              : getDetailsOfBooking.booking_details.status === 'REFUND'
              ? 'orange'
              : getDetailsOfBooking.booking_details.status === 'PENDING'
              ? 'grey'
              : getDetailsOfBooking.booking_details.status === 'RESCHEDULE'
              ? 'skyblue'
              : 'red'
          }
        />
        <TextRow
          heading={I18n.t('statusPayment')}
          text={getDetailsOfBooking.booking_details.payment_status}
          color={
            getDetailsOfBooking.booking_details.payment_status === 'SUCCESS'
              ? 'green'
              : getDetailsOfBooking.booking_details.payment_status === 'REFUND'
              ? 'orange'
              : getDetailsOfBooking.booking_details.payment_status === 'PENDING'
              ? 'grey'
              : 'red'
          }
        />
        <TextRow
          heading={'Amount'}
          text={
            I18n.t('statusAed') +
            getDetailsOfBooking.booking_details.final_service_price
          }
        />
        {getDetailsOfBooking.booking_details.booking_comment && (
          <TextRow
            heading={I18n.t('statusInst')}
            text={getDetailsOfBooking.booking_details.booking_comment}
          />
        )}
        <TextRow
          heading={I18n.t('statusAddress')}
          text={
            getDetailsOfBooking.booking_details.addr_address +
            ', ' +
            getDetailsOfBooking.booking_details.addr_city +
            ', ' +
            getDetailsOfBooking.booking_details.addr_state
          }
        />
        <TextRow
          heading={I18n.t('statusCont')}
          text={getDetailsOfBooking.booking_details.addr_phonenumber}
        />
        <Text style={{marginBottom: RFValue(5), fontWeight: 'bold'}}>
          {I18n.t('statusDetails')}:
        </Text>
        <Table
          borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}
          style={{textAlign: 'center'}}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.text} />
          <Row
            data={[
              'Convenience Fee',
              `+ ₹${getDetailsOfBooking.booking_details.vat_amount}`,
            ]}
            textStyle={styles.text}
          />
          <Row
            data={[
              'Total Amount',
              `₹${getDetailsOfBooking.booking_details.final_service_price}`,
            ]}
            style={[styles.head]}
            textStyle={[styles.text]}
          />
        </Table>

        <View style={{marginTop: 20}}>
          <Text style={{fontWeight: 'bold'}}>Complaint</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>Subject : </Text>
            <Text>{getDetailsOfBooking.complaints.cr_subject}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold'}}>Comment : </Text>
            <Text>{getDetailsOfBooking.complaints.cr_comment}</Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            marginTop: RFValue(20),
            flexDirection: 'row',
          }}>
          {getDetailsOfBooking.complaints.cr_status === '0' ? (
            <Button
              mode="contained"
              color="green"
              compact
              onPress={() =>
                navigation.navigate('feedBack', {
                  complaintId: getDetailsOfBooking.complaints.id,
                  bookingId: getDetailsOfBooking.complaints.cr_booking_id,
                })
              }
              style={{
                width: '100%',
              }}
              uppercase={true}
              contentStyle={{height: 50}}>
              Complete Status
            </Button>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(15),
  },
  cardContainer1: {
    padding: RFValue(10),
    width: '98%',
    alignSelf: 'center',
    marginBottom: 25,
  },
  location: {
    color: Colors.black,
    fontSize: RFValue(13),
    fontWeight: 'bold',
    paddingBottom: RFValue(5),
  },
  address: {
    color: Colors.black,
    paddingBottom: RFValue(10),
    fontSize: RFValue(13),
  },
  contact: {
    fontSize: RFValue(13),
    color: Colors.black,
  },
  name: {
    marginBottom: RFValue(5),
    fontSize: RFValue(15),
    color: Colors.black,
    fontWeight: 'bold',
  },
  service: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  completed: {
    marginBottom: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobs: {
    color: Colors.black,
    fontSize: RFValue(15),
    marginTop: RFValue(8),
    fontWeight: 'bold',
    borderBottomWidth: RFValue(1),
    marginBottom: RFValue(2),
  },
  submit: {
    width: '50%',
    borderRadius: RFValue(50),
    alignSelf: 'center',
    marginVertical: RFValue(20),
  },
  row2: {
    flexDirection: 'row',
    paddingTop: RFValue(5),
  },

  head: {
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    fontSize: RFValue(14),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headingStyles: {
    marginBottom: RFValue(5),
    fontWeight: 'bold',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },

  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 14,
    marginLeft: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
    //color:'white',
    marginLeft: 10,
  },
  iconStyle: {
    width: 30,
    height: 30,
    color: 'white',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
  },
});

export default UserComplaintDetailScreen;
