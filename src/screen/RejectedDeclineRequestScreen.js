import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import {Button, Card, ActivityIndicator} from 'react-native-paper';
import * as requestAction from '../store/actions/request';
import Colors from '../constant/Colors';
import I18n from '../languages/I18n';
import RFValue from '../../rfvalue';

const RejectedDeclineRequestScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const {get_decline_rejected_booking_list} = useSelector(
    state => state.request,
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.get_rejected_decline_list());
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
    <View style={styles.screen}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      {get_decline_rejected_booking_list.length === 0 ? (
        <Text style={styles.activity}>Data Not Found!</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={get_decline_rejected_booking_list}
          keyExtractor={item => item.booking_id}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.content,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>
                      {I18n.t('bookingId')}:{' '}
                    </Text>
                    {item.booking_id}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>
                      Reason for declining the service:{' '}
                    </Text>
                    {item.deny_reason}
                  </Text>
                </View>
                <View style={styles.row1}>
                  <Text style={styles.text2}>
                    <Text style={{fontWeight: 'bold'}}>Status : </Text>
                    <Text style={styles.text1}>{item.status}</Text>
                  </Text>
                </View>
                {item.admin_reason !== null && (
                  <View style={styles.row1}>
                    <Text style={styles.text2}>
                      <Text style={{fontWeight: 'bold'}}>Admin Reason : </Text>
                      <Text style={styles.text1}>{item.admin_reason}</Text>
                    </Text>
                  </View>
                )}
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    fontWeight: 'bold',
  },
  iosHeading: {
    marginTop: RFValue(-10),
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
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  service: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    paddingTop: RFValue(8),
  },
  text2: {
    fontSize: RFValue(13),
    paddingBottom: RFValue(3),
    color: Colors.black,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(5),
  },
  pending: {
    fontSize: RFValue(13),
    color: Colors.primary,
  },
  cancel: {
    fontSize: RFValue(13),
    backgroundColor: Colors.darkYellow,
    color: Colors.white,
    padding: RFValue(5),
    textTransform: 'capitalize',
    borderRadius: RFValue(2),
  },
  accept: {
    fontSize: RFValue(13),
    backgroundColor: 'green',
    color: Colors.white,
    padding: RFValue(5),
    textTransform: 'capitalize',
    borderRadius: RFValue(5),
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reject: {
    fontSize: RFValue(13),
    backgroundColor: 'red',
    color: Colors.white,
    padding: RFValue(5),
    textTransform: 'capitalize',
    borderRadius: RFValue(5),
  },
  completed: {
    fontSize: RFValue(13),
    backgroundColor: Colors.primary,
    color: Colors.white,
    padding: RFValue(5),
    textTransform: 'capitalize',
    borderRadius: RFValue(2),
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: RFValue(250),
  },
});

export default RejectedDeclineRequestScreen;
