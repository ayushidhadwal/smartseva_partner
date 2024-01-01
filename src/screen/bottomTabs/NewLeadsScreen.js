import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import {
  Button,
  Card,
  ActivityIndicator,
  Divider,
  TextInput,
} from 'react-native-paper';
import dayjs from 'dayjs';
import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';

const NewLeadsScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({
    type: '',
    val: '',
  });
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const {pendingRequest} = useSelector(state => state.request);

  const setJobList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.getPendingRequests());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setJobList);

    return () => unsubscribe;
  }, [navigation, setJobList]);

  const onClickHandler = async (booking_id, status) => {
    setError(null);
    setStatusLoading({
      type: status,
      val: booking_id,
    });

    try {
      await dispatch(
        requestAction.request_service_response(booking_id, status),
      );
      {
        status === 'ACCEPTED' && navigation.navigate('Booking');
      }
      setStatusLoading({
        type: '',
        val: '',
      });
    } catch (e) {
      setError(e.message);
      setStatusLoading({
        type: '',
        val: '',
      });
    }
  };

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
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      {pendingRequest.length === 0 ? (
        <Text style={styles.activity}>No New Requests</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={pendingRequest}
          keyExtractor={item => item.booking_id}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.content,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <View style={styles.row1}>
                  <Text style={styles.text1}>{item.addr_username}</Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>Service :</Text>
                    {`${item.service_name}\n${item.subservice_name}`}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>
                      {I18n.t('bookingId')}:{' '}
                    </Text>
                    {item.bookid}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>Amount: </Text>₹{' '}
                    {item.st_service_price}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>City: </Text>
                    {item.addr_city}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>Pincode: </Text>
                    {item.addr_pincode}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>Date & Time : </Text>
                    {item.booking_date}, {item.booking_time}
                  </Text>
                </View>

                <Divider style={{marginTop: RFValue(4)}} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: RFValue(8),
                  }}>
                  <Button
                    mode="outlined"
                    labelStyle={{color: 'green'}}
                    onPress={() => onClickHandler(item.booking_id, 'ACCEPTED')}
                    loading={
                      statusLoading.type === 'ACCEPTED' &&
                      statusLoading.val === item.booking_id
                    }
                    disabled={
                      statusLoading.type === 'ACCEPTED' &&
                      statusLoading.val === item.booking_id
                    }>
                    {I18n.t('acceptBtn')}
                  </Button>
                  <Button
                    mode="outlined"
                    labelStyle={{color: 'red'}}
                    loading={
                      statusLoading.type === 'REJECTED' &&
                      statusLoading.val === item.booking_id
                    }
                    disabled={
                      statusLoading.type === 'REJECTED' &&
                      statusLoading.val === item.booking_id
                    }
                    onPress={() =>
                      Alert.alert(
                        'Important',
                        'Are you sure you want to reject this service.',
                        [
                          {
                            text: 'No',
                          },
                          {
                            text: 'Yes',
                            onPress: () =>
                              onClickHandler(item.booking_id, 'REJECTED'),
                          },
                        ],
                      )
                    }>
                    {I18n.t('rejBtn')}
                  </Button>
                </View>
              </Card>
            );
          }}
        />
      )}
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{height: 50}}
        icon="phone"
        onPress={() => navigation.navigate('help')}>
        {I18n.t('help')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    fontWeight: 'bold',
  },
  iosHeading: {
    marginTop: RFValue(-18),
    fontWeight: 'bold',
  },
  btn: {
    width: '30%',
    borderRadius: RFValue(20),
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  content: {
    marginBottom: RFValue(10),
    marginHorizontal: RFValue(10),
    padding: RFValue(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text1: {
    fontWeight: 'bold',
    paddingBottom: RFValue(5),
  },
  service: {
    fontWeight: 'bold',
    paddingBottom: RFValue(5),
    paddingTop: RFValue(5),
  },
  text2: {
    paddingBottom: RFValue(5),
    color: 'black',
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pending: {
    fontSize: RFValue(13),
    color: Colors.darkYellow,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  cancel: {
    fontSize: RFValue(13),
    color: 'red',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  complete: {
    fontSize: RFValue(13),
    color: 'green',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: RFValue(250),
  },
});

export default NewLeadsScreen;
