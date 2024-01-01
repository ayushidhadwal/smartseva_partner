import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import Colors from '../../constant/Colors';
import Rating from '../../components/Rating';
import * as userActions from '../../store/actions/user';
import {URL} from '../../constant/base_url';
import RFValue from '../../../rfvalue';

const MyReviewScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {myReviews} = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.setMyReview());
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
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={myReviews}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => (
          <Card
            style={[
              styles.cardContainer,
              index === 0 && {marginTop: RFValue(10)},
            ]}>
            <View style={styles.rowStyle}>
              <Image source={{uri: URL + item.photo}} style={styles.imgStyle} />
              <View style={{marginLeft: RFValue(15)}}>
                <Text style={styles.username}>{item.name}</Text>
                <Text style={styles.time}>
                  {dayjs(item.created_at).format('DD MMM YYYY, hh:mm a')}
                </Text>
              </View>
            </View>
            <Rating
              rating={(item.services + item.vofm + item.behaviour) / 3}
              service={item.services}
              moneyOfValue={item.vofm}
              behaviour={item.behaviour}
            />
            {item.images !== '' && (
              <Image
                source={{uri: URL + item.images}}
                style={styles.reviewImgStyle}
              />
            )}

            {item.message !== '' && (
              <View>
                <Text>Client Review:</Text>
                <Text style={styles.comment}>{item.message}</Text>
              </View>
            )}
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: RFValue(10),
    marginHorizontal: RFValue(10),
    padding: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(5),
  },
  imgStyle: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: RFValue(100),
  },
  reviewImgStyle: {
    width: RFValue(100),
    height: RFValue(100),
    alignSelf: 'center',
    margin: 5,
  },
  username: {
    fontWeight: 'bold',
    color: Colors.primary,
    fontSize: RFValue(15),
  },
  time: {
    color: Colors.primary,
    fontSize: RFValue(10),
  },
  quotes: {
    fontSize: RFValue(15),
    color: Colors.primary,
    fontWeight: 'bold',
  },
  comment: {
    color: 'grey',
    fontWeight: 'bold',
  },
});

export default MyReviewScreen;
