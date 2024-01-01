import dayjs from 'dayjs';
import React, {
  useState,
  useCallback,
  useEffect,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Subheading,
  TextInput,
  Portal,
  Modal,
} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Row, Rows, Table} from 'react-native-table-component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Picker} from '@react-native-picker/picker';

import {launchImageLibrary} from 'react-native-image-picker';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

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

const BookingStatusScreen = props => {
  const [date, setDate] = useState(null);
  const [image, setImage] = useState([]);
  const [comment, setComment] = useState('');
  const [amt, setAmt] = useState('');

  const [visible, setVisible] = React.useState(false);
  const [other, setOther] = React.useState(false);

  const hideModal = () => setVisible(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const {booking_id} = props.route.params;
  const {getDetailsOfBooking} = useSelector(state => state.request);
  const {deny_reasons} = useSelector(state => state.request);

  const [selectedReason, setSelectedReason] = useState('');

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

  const onclickHandler = () => {
    setDate(new Date());
  };

  const onsubmitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.job_completed(booking_id, image, date, comment, amt),
      );
      setLoading(false);
      Alert.alert('Alert', 'Job Completed Successfully!', [
        {
          text: 'OK',
          onPress: () => props.navigation.goBack(),
        },
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [dispatch, booking_id, image, date, comment, amt, props.navigation]);

  const declineRequestReason = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(requestAction.get_decline_Request_Reason());
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    declineRequestReason();
  }, [declineRequestReason]);

  const declineRequestHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.decline_Request(
          selectedReason === 'Other' ? other : selectedReason,
          booking_id,
        ),
      );
      setLoading(false);
      setVisible(false);
      Alert.alert('Alert', 'Your Request is  declined successfully', [
        {text: 'OK', onPress: () => navigation.pop(2)},
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [selectedReason, other, booking_id]);

  const _pickImageHandler = async () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            _openImagePicker();
            break;
          case RESULTS.UNAVAILABLE:
            setError('This feature is not available on this device!');
            break;
          case RESULTS.DENIED:
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.PHOTO_LIBRARY
                : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            ).then(requestResult => {
              if (requestResult === RESULTS.GRANTED) {
                _openImagePicker();
              }
            });
            break;
          case RESULTS.LIMITED:
            _openImagePicker();
            break;
          case RESULTS.BLOCKED:
            setError(
              'The permission is denied! Please enable storage permission.',
            );
            openSettings().catch(settingsErr =>
              setError('Unable to open settings!'),
            );
            break;
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const _openImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0,
      });

      if ('assets' in result) {
        setImage(result.assets);
      }
    } catch (e) {
      setError(e.message);
    }
  };

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
              `Convenience Fee`,
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
        <View
          style={{
            // flex: 1,
            justifyContent: 'space-between',
            marginTop: RFValue(20),
            flexDirection: 'row',
          }}>
          <Button
            mode="contained"
            color="green"
            compact
            onPress={onclickHandler}
            style={{
              borderRadius: RFValue(50),
              width: '45%',
            }}
            uppercase={true}
            contentStyle={{height: 50}}
            disabled={date !== null}>
            Job Done
          </Button>
          <Button
            mode="contained"
            color="red"
            compact
            onPress={() => setVisible(true)}
            style={{
              borderRadius: RFValue(50),
              //marginBottom: RFValue(8),
              width: '45%',
            }}
            contentStyle={{height: 50}}>
            DECLINE
          </Button>
        </View>
      </View>
      {getDetailsOfBooking.booking_details.status === 'ACCEPTED' && (
        <>
          {date ? (
            <KeyboardAwareScrollView>
              <View style={[styles.completed, {flexDirection: 'column'}]}>
                <Subheading style={{marginBottom: RFValue(5), color: 'red'}}>
                  {I18n.t('markJobBtnMsg')}
                </Subheading>
                <Button
                  mode="outlined"
                  icon="attachment"
                  onPress={_openImagePicker}>
                  {I18n.t('attachBtn')}
                </Button>
                {image.length !== 0 && (
                  <View style={styles.row2}>
                    <Text style={styles.text}>{I18n.t('uploadText')}</Text>
                    <Ionicons name="checkmark-done" size={24} color="black" />
                  </View>
                )}
              </View>
              <TextInput
                label={'Additional Amount'}
                mode="outlined"
                style={{backgroundColor: 'white', marginBottom: RFValue(10)}}
                value={amt}
                onChangeText={setAmt}
              />
              <TextInput
                label={I18n.t('textInputLabel')}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={{backgroundColor: 'white', marginBottom: RFValue(10)}}
                value={comment}
                onChangeText={setComment}
              />
              <Text style={styles.jobs}>
                {I18n.t('timeStamp')}:{' '}
                {dayjs(date).format('DD/MM/YYYY hh:mm A')}
              </Text>
              <Button
                mode="contained"
                style={styles.submit}
                contentStyle={{height: 50}}
                onPress={onsubmitHandler}
                loading={loading}
                disabled={loading}>
                {I18n.t('submitBtn')}
              </Button>
            </KeyboardAwareScrollView>
          ) : null}
        </>
      )}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <Picker
            mode="dropdown"
            selectedValue={selectedReason}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedReason(itemValue)
            }>
            {deny_reasons.map(m => (
              <Picker.Item label={m.Reason} value={m.Reason} />
            ))}
            <Picker.Item label="Other" value="Other" />
          </Picker>
          <View style={{marginTop: 20}}>
            {selectedReason === 'Other' && (
              <TextInput
                label="Write your Reason for declining the booking Request"
                value={other}
                onChangeText={setOther}
                numberOfLines={5}
                multiline={true}
              />
            )}
            <Button
              mode="contained"
              color="#f5b942"
              //onPress={()=>setVisible(false)}
              onPress={declineRequestHandler}
              style={{
                borderRadius: RFValue(50),
                marginVertical: RFValue(15),
                width: '60%',
                alignSelf: 'center',
              }}
              labelStyle={{color: 'white'}}
              contentStyle={{height: 50}}>
              submit
            </Button>
          </View>
        </Modal>
      </Portal>
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

export default BookingStatusScreen;
