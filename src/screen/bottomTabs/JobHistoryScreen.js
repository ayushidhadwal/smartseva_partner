import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  View,
  Alert,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';

const JobHistoryScreen = ({navigation}) => {
  const {jobHistoryList} = useSelector(state => state.request);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.get_job_history());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [dispatch, navigation]);

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

      {jobHistoryList.length === 0 ? (
        <Text style={styles.activity}>NO JOB COMPLETED</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={jobHistoryList}
          keyExtractor={item => item.booking_id}
          renderItem={({item, index}) => {
            return (
              <Card
                style={[
                  styles.cardContainer,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.text}>
                    {I18n.t('statusBookId')}: {item.booking_id}
                  </Text>
                  <Button
                    contentStyle={{
                      height: 35,
                      //backgroundColor: "#3498db",
                    }}
                    labelStyle={{
                      fontWeight: 'bold',
                      //color: Colors.white
                    }}
                    mode="outlined"
                    uppercase={false}
                    onPress={() =>
                      navigation.navigate('HistoryStatus', {
                        booking_id: item.booking_id,
                      })
                    }>
                    {/*Completed*/}
                    {I18n.t('seeDetailsBtn')}
                  </Button>
                </View>
                <Text style={styles.status}>
                  {I18n.t('statusType')}: {item.service_status}
                </Text>
                <Text style={styles.subService}>
                  {I18n.t('jobDoneAt')}: {item.completeDate}
                </Text>
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
  cardContainer: {
    padding: RFValue(10),
    marginBottom: RFValue(10),
    marginHorizontal: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    //backgroundColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: RFValue(250),
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontWeight: 'bold',
  },
  iosHeading: {
    marginTop: RFValue(-18),
    fontWeight: 'bold',
  },
  service_name: {
    //fontSize: RFValue(15),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  status: {
    textTransform: 'capitalize',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: 'green',
  },
  text: {
    fontSize: RFValue(14),
    // color: Colors.white,
  },
  subService: {
    fontSize: RFValue(15),
    // color: Colors.white,
  },
});

export default JobHistoryScreen;
