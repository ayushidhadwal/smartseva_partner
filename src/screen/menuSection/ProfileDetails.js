import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  ActivityIndicator,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Headline, Title, Subheading} from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as userActions from '../../store/actions/user';
import {IMG_URL} from '../../constant/base_url';
import Colors from '../../constant/Colors';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';

const ProfileDetails = ({navigation}) => {
  const dispatch = useDispatch();
  const {partner} = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [img, setImg] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.set_Profile());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  const imgClickHandler = () => {
    setImg(true);
  };

  const images = [
    {
      url: IMG_URL + partner.photo,
    },
  ];

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
    <ScrollView showsVerticalScrollIndicator={false} style={styles.screen}>
      <>
        <Pressable
        // onPress={imgClickHandler}
        >
          <View style={styles.imgContainer}>
            <Image
              // source={{ uri: IMG_URL + partner.photo }
              source={require('../../assets/icon.png')}
              style={styles.img}
            />
            {img && (
              <Modal
                visible={true}
                transparent={true}
                onRequestClose={() => setImg(false)}>
                <ImageViewer
                  imageUrls={images}
                  enableSwipeDown={true}
                  onSwipeDown={() => setImg(false)}
                />
              </Modal>
            )}
          </View>
        </Pressable>
        <View style={styles.content}>
          <Headline style={styles.company_name}>
            {partner.company_name}
          </Headline>
          <Text style={styles.address}>{partner.address}</Text>
          <Subheading style={styles.subheading}>{I18n.t('contUs')}:</Subheading>
          <Text style={styles.name}>{partner.name}</Text>
          <Text style={styles.email}>{partner.email}</Text>

          <Text style={{paddingTop: RFValue(2)}}>{partner.mobile}</Text>
          <Subheading style={styles.subheading}>{I18n.t('abtUs')}:</Subheading>
          <Text style={styles.aboutUs}>{partner.business_name}</Text>
          <Text style={styles.aboutUs}>{partner.profession}</Text>
          <Subheading style={styles.subheading}>{I18n.t('ourExp')}:</Subheading>
          <Text style={styles.text}>{partner.experience_text}</Text>
        </View>
        {partner.twitter_link ||
        partner.facebook_link ||
        partner.instagram_link ? (
          <>
            <Title style={styles.content2}>{I18n.t('followUs')}:</Title>
            <View style={styles.content1}>
              {partner.twitter_link && (
                <Ionicons
                  name="logo-twitter"
                  size={26}
                  color={Colors.grey}
                  onPress={() => Linking.openURL(partner.twitter_link)}
                />
              )}
              {partner.facebook_link && (
                <Ionicons
                  name="logo-facebook"
                  size={26}
                  color={Colors.grey}
                  onPress={() => Linking.openURL(partner.facebook_link)}
                />
              )}
              {partner.instagram_link && (
                <Ionicons
                  name="logo-instagram"
                  size={26}
                  color={Colors.grey}
                  onPress={() => Linking.openURL(partner.instagram_link)}
                />
              )}
            </View>
          </>
        ) : null}
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('20%'),
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  content: {
    padding: RFValue(15),
  },
  content1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: RFValue(20),
  },
  subheading: {
    marginTop: RFValue(12),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  name: {
    textTransform: 'capitalize',
    fontSize: RFValue(14),
  },
  company_name: {
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  address: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  email: {
    textTransform: 'lowercase',
    fontSize: RFValue(14),
  },
  aboutUs: {
    textTransform: 'capitalize',
    fontSize: RFValue(14),
  },
  text: {
    fontSize: RFValue(14),
  },
  content2: {
    paddingHorizontal: RFValue(15),
    textDecorationLine: 'underline',
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileDetails;
