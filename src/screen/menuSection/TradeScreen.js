import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button, TextInput, ActivityIndicator} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
// import * as ImagePicker from 'expo-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import * as IntentLauncher from 'expo-intent-launcher';

import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
import {IMG_URL} from '../../constant/base_url';
// import {androidPackageName} from '../../constant/common';
import I18n from '../../languages/I18n';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import RFValue from '../../../rfvalue';

const TradeScreen = ({navigation}) => {
  const [number, setNumber] = useState('');
  const [startdate, setStartdate] = useState(new Date());
  const [expiredate, setExpiredate] = useState(new Date());
  const [image, setImage] = useState({
    name: '',
    uri: '',
    type: '',
  });
  const [image1, setImage1] = useState(null);
  const [loading, setLoading] = useState(false);
  const [screenloading, setScreenLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const {trade} = useSelector(state => state.request);

  const [isDatePickerVisible_start, setDatePickerVisibility_start] =
    useState(false);
  const [isDatePickerVisible_expire, setDatePickerVisibility_expire] =
    useState(false);

  const showDatePicker_start = useCallback(() => {
    setDatePickerVisibility_start(true);
  }, []);

  const showDatePicker_expire = useCallback(() => {
    setDatePickerVisibility_expire(true);
  }, []);

  const hideDatePicker_start = useCallback(() => {
    setDatePickerVisibility_start(false);
  }, []);
  const hideDatePicker_expire = useCallback(() => {
    setDatePickerVisibility_expire(false);
  }, []);

  const handleConfirm_start = useCallback(
    date => {
      setStartdate(date);
      hideDatePicker_start();
    },
    [hideDatePicker_start],
  );

  const handleConfirm_expire = useCallback(
    date => {
      setExpiredate(date);
      hideDatePicker_expire();
    },
    [hideDatePicker_expire],
  );

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
        selectionLimit: 1,
      });

      if ('assets' in result) {
        result.assets.forEach(asset => {
          setImage({
            name: asset.fileName,
            uri: asset.uri,
            type: asset.type,
          });
        });
      }
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setScreenLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getTrade());
      } catch (e) {
        setError(e.message);
      }
      setScreenLoading(false);
    });

    return () => unsubscribe;
  }, [dispatch, navigation]);

  useEffect(() => {
    setNumber(trade.trade_license_number);
    setStartdate(trade.startdate);
    setExpiredate(trade.expiredate);
    setImage1(trade.tradelicense);
  }, [trade]);

  const onclickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.updateTrade(
          number,
          startdate,
          expiredate,
          !image.uri ? IMG_URL + image1 : image,
        ),
      );
      setLoading(false);
      Alert.alert('Alert Title', 'Updated Successfully !!!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [dispatch, number, startdate, expiredate, image, image1, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  if (screenloading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView>
        <View style={styles.nameContainer}>
          <Text style={styles.label1}>{I18n.t('tradeLicNo')}</Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={number}
            onChangeText={setNumber}
          />
          <Text style={styles.label1}>{I18n.t('tradeLicDate')}</Text>
          <Pressable onPress={showDatePicker_start} style={styles.rowContainer}>
            <Text style={styles.date}>
              {dayjs(startdate).format('YYYY-MM-DD')}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible_start}
            mode="date"
            onConfirm={handleConfirm_start}
            onCancel={hideDatePicker_start}
            value={startdate}
            onChange={setStartdate}
          />
          <Text style={styles.label1}>{I18n.t('tradeLicExpDate')}</Text>
          <Pressable
            style={styles.rowContainer}
            onPress={showDatePicker_expire}>
            <Text style={styles.date}>
              {dayjs(expiredate).format('YYYY-MM-DD')}
            </Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible_expire}
            mode="date"
            onConfirm={handleConfirm_expire}
            onCancel={hideDatePicker_expire}
            value={expiredate}
            minimumDate={new Date()}
            onChange={setExpiredate}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.label1}>{I18n.t('uploadImg')}</Text>
            <Button mode="contained" onPress={_pickImageHandler}>
              {I18n.t('upload')}
            </Button>
          </View>
          <Image
            source={{
              uri: image.uri ? image.uri : IMG_URL + image1,
            }}
            style={{
              width: RFValue(100),
              height: RFValue(100),
              marginVertical: RFValue(12),
            }}
          />
          <Button
            mode="outlined"
            icon="check"
            loading={loading}
            disabled={loading}
            onPress={onclickHandler}
            style={{alignSelf: 'center'}}>
            {I18n.t('saveBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    justifyContent: 'space-between',
  },
  heading: {
    paddingLeft: RFValue(20),
  },
  nameContainer: {
    padding: RFValue(20),
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  label1: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    paddingTop: RFValue(5),
  },
  input1: {
    marginBottom: RFValue(15),
    backgroundColor: Colors.white,
  },
  rowContainer: {
    paddingVertical: RFValue(10),
    borderWidth: RFValue(1),
    marginTop: RFValue(8),
    marginBottom: RFValue(12),
  },
  date: {
    fontSize: RFValue(13.5),
    paddingLeft: RFValue(12),
  },
});

export default TradeScreen;
