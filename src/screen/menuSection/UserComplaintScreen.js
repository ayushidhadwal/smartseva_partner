import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {Button, Card} from 'react-native-paper';
import dayjs from 'dayjs';
import * as userActions from '../../store/actions/user';
import Colors from '../../constant/Colors';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';

const TextRow = ({heading, desc}) => {
  return (
    <View style={styles.viewStyle}>
      <Text style={styles.headingStyle}>{heading}:</Text>
      <Text style={styles.textStyle}>{desc}</Text>
    </View>
  );
};

const UserComplaintScreen = ({navigation}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {complaints} = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.getComplaints());
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {complaints.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: RFValue(17),
              color: Colors.primary,
              textAlign: 'center',
            }}>
            {I18n.t('noComplaint')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={complaints}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
          renderItem={({item, index}) => {
            return (
              <Card
                style={styles.cardStyle}
                onPress={() =>
                  navigation.navigate('complaintDetail', {
                    booking_id: item.cr_booking_id,
                  })
                }>
                <TextRow
                  heading={I18n.t('statusBookId')}
                  desc={item.cr_booking_id}
                />
                <TextRow heading={I18n.t('uname')} desc={item.username} />
                <TextRow
                  heading={I18n.t('complaintSubj')}
                  desc={item.cr_subject}
                />
                <TextRow heading={I18n.t('complaint')} desc={item.cr_comment} />
                <TextRow
                  heading={I18n.t('dateTime')}
                  desc={dayjs(item.created_at).format('DD-MM-YYYY , hh:mm a')}
                />
                <Button
                  mode={'contained'}
                  style={{
                    width: '30%',
                    marginTop: RFValue(10),
                    borderRadius: RFValue(100),
                    alignSelf: 'flex-end',
                  }}
                  icon={'reply-all'}
                  contentStyle={{flexDirection: 'row-reverse'}}
                  onPress={() =>
                    navigation.navigate('feedBack', {
                      complaintId: item.id,
                      bookingId: item.cr_booking_id,
                    })
                  }>
                  {I18n.t('replyBtn')}
                </Button>
              </Card>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: RFValue(15),
  },
  cardStyle: {
    padding: RFValue(10),
    marginHorizontal: RFValue(15),
    marginBottom: RFValue(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 20,
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(10),
    marginBottom: RFValue(5),
  },
  headingStyle: {
    flex: 0.5,
    fontWeight: 'bold',
  },
  textStyle: {
    flex: 1,
    textAlign: 'right',
  },
});

export default UserComplaintScreen;
