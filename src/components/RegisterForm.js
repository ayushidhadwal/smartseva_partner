import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  Alert,
  Linking,
  I18nManager,
} from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { SearchableDropdown } from '../components/SearchableDropdown';
import Colors from '../constant/Colors';
import * as authActions from '../store/actions/auth';
import I18n from '../languages/I18n';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const RegisterForm = ({ navigation }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('');
  const [trade_license_number, setTrade_license_number] = useState('');
  const [startdate, setStartdate] = useState(new Date());
  const [expiredate, setExpiredate] = useState(new Date());
  const [image, setImage] = useState({
    name: '',
    uri: '',
    type: '',
  });
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [cityloading, setCityLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({
    lat: '',
    long: '',
  });
  const [state, setState] = useState('');
  const [cityCode, setCityCode] = useState('');

  const dispatch = useDispatch();
  const {states, cities} = useSelector(state => state.auth);

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

  const setCity = useCallback(
    async state => {
      if (!state || state === 0 || state === null) {
        return;
      }
      setCityLoading(true);
      setError(null);
      try {
        await dispatch(authActions.setCities(state));
      } catch (e) {
        setError(e.message);
      }
      setCityLoading(false);
    },
    [dispatch],
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
    setImage({
      name: '',
      uri: '',
      type: '',
    });
  }, [error]);

  const _openImagePicker = async () => {
    setImageLoader(true);
    setImage({
      name: '',
      uri: '',
      type: '',
    });
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
      setImageLoader(false);
    } catch (e) {
      setImageLoader(false);
      setImage({
        name: '',
        uri: '',
        type: '',
      });
      setError(e.message);
    }
  };

  const _onRegisterHandler = useCallback(async () => {
    setBtnLoading(true);
    setError(null);

    try {
      await dispatch(
        authActions.register(
          firstname,
          lastname,
          email,
          password,
          passwordConfirmation,
          mobile,
          company,
          state,
          cityCode,
          trade_license_number,
          image,
          startdate,
          expiredate,
          location.lat,
          location.long,
        ),
      );
      setBtnLoading(false);
      navigation.replace('VerifyAccount');
    } catch (e) {
      setError(e.message);
      setBtnLoading(false);
    }
  }, [
    dispatch,
    firstname,
    lastname,
    email,
    password,
    passwordConfirmation,
    mobile,
    company,
    state,
    cityCode,
    trade_license_number,
    image,
    startdate,
    expiredate,
    location.lat,
    location.long,
    navigation,
  ]);

  const requestForLocationPermission = useCallback(() => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log('denied');
            // setModalVisible(true);
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.LOCATION_ALWAYS
                : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ).then(requestResult => {
              if (requestResult === RESULTS.GRANTED) {
                getLocation();
              } else {
                requestForLocationPermission();
              }
            });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('granted');
            // setModalVisible(false);
            getLocation();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(e => {
        setError(e.message);
      });
  }, []);

  useEffect(() => {
    requestForLocationPermission();
  }, [requestForLocationPermission]);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {coords} = position;
        setLocation({
          lat: coords.latitude,
          long: coords.longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const onSelectState = async value => {
    setState(value);
    setCityCode('');
    await setCity(value);
  };

  const onSelectCity = value => {
    setCityCode(value);
  };

  return (
    <View
      style={styles.screen}
    >
      <View
        style={styles.imgContainer}
      >
        <Image source={require('../assets/icon.png')}
          style={styles.logoImg}
        />
      </View>
      <Title
      style={styles.register}
      >{I18n.t('reg')}</Title>
      <View
      style={styles.form}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          <TextInput
            left={<TextInput.Icon name="account" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('fname')}
            style={{width: '48%', backgroundColor: Colors.white}}
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('lname')}
            style={{width: '48%', backgroundColor: Colors.white}}
            value={lastname}
            onChangeText={setLastname}
          />
        </View>
         <TextInput
          left={<TextInput.Icon name="email" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('email')}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('password')}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          left={<TextInput.Icon name="lock" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('confPass')}
          secureTextEntry
          style={styles.input}
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />
        <TextInput
          left={
            <TextInput.Icon name="office-building" color={Colors.primary} />
          }
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('compName')}
          style={styles.input}
          value={company}
          onChangeText={setCompany}
        />
         <View
          style={{
            width: '93%',
            alignSelf: 'center',
            backgroundColor: Colors.white,
          }}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{alignSelf: 'center', padding: 14}}
            />
          ) : (
            <SearchableDropdown
              label={'Select State'}
              data={states.map(m => ({
                name: m.name,
                key: m.id,
                value: m.id,
              }))}
              leftIcon={
                <TextInput.Icon
                  name={'map-marker-radius-outline'}
                  color={Colors.primary}
                />
              }
              selectedValue={state}
              onSelectValue={onSelectState}
            />
          )}
        </View> 


         <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          <TextInput
            left={<TextInput.Icon name="phone" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('code')}
            style={{
              backgroundColor: Colors.white,
              width: '40%',
            }}
            editable={false}
            value={'+91'}
          />
          <TextInput
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('mob')}
            style={styles.number}
            keyboardType="numeric"
            value={mobile}
            onChangeText={setMobile}
          />
        </View>
        <View
          style={{
            width: '93%',
            alignSelf: 'center',
            backgroundColor: Colors.white,
          }}>
          {cityloading ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={{alignSelf: 'center', padding: 14}}
            />
          ) : (
            <SearchableDropdown
              label={'Select City'}
              data={cities.map(m => ({
                name: m.name,
                key: m.id,
                value: m.id,
              }))}
              leftIcon={
                <TextInput.Icon name={'map-marker'} color={Colors.primary} />
              }
              selectedValue={cityCode}
              onSelectValue={onSelectCity}
            />
          )}
        </View>
        <TextInput
          left={
            <TextInput.Icon name="card-text-outline" color={Colors.primary} />
          }
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('lic')}
          style={styles.input1}
          value={trade_license_number}
          onChangeText={setTrade_license_number}
        />
        {trade_license_number ? (
          <View>
            <View style={styles.row}>
              <Text style={styles.text_start}>{I18n.t('issueDate')}</Text>
              <Text style={styles.text_expire}>{I18n.t('expDate')}</Text>
            </View>
            <View style={styles.row1}>
              <Pressable
                style={styles.dateContainer}
                onPress={showDatePicker_start}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={Colors.primary}
                  style={{paddingHorizontal: 10}}
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible_start}
                  mode="date"
                  onConfirm={handleConfirm_start}
                  onCancel={hideDatePicker_start}
                  value={startdate}
                  onChange={setStartdate}
                />
                <Text style={{fontSize: 15}}>
                  {dayjs(startdate).format('DD/MM/YYYY')}
                </Text>
              </Pressable>
              <Pressable
                style={styles.dateContainer}
                onPress={showDatePicker_expire}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={Colors.primary}
                  style={{marginRight: 12}}
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible_expire}
                  mode="date"
                  onConfirm={handleConfirm_expire}
                  onCancel={hideDatePicker_expire}
                  value={expiredate}
                  minimumDate={new Date()}
                  onChange={setExpiredate}
                />
                <Text style={{fontSize: 15}}>
                  {dayjs(expiredate).format('DD/MM/YYYY')}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null} 

        <View
          style={{
            marginTop: 20,
          }}>
          <>
            <Button
              mode="outlined"
              onPress={_openImagePicker}
              icon={'attachment'}
              style={{backgroundColor: '#3498db'}}
              labelStyle={{color: Colors.white}}
              contentStyle={{height: 50}}
              disabled={imageLoader}
              loading={imageLoader}>
              {I18n.t('uploadLic')}
            </Button>
          </>
          {image.uri ? (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <Text
                style={{
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  color: Colors.primary,
                }}>
                uploaded successfully
              </Text>
              <Ionicons
                name="checkmark-done"
                size={24}
                color={Colors.primary}
                style={{paddingHorizontal: 2}}
              />
            </View>
          ) : null}
        </View>
        <Button
          mode="contained"
          style={{
            //width: "40%",
            //alignSelf: "center",
            marginVertical: 10,
            backgroundColor: Colors.primary,
          }}
          contentStyle={{height: 50, backgroundColor: ''}}
          onPress={_onRegisterHandler}
          loading={btnLoading}
          disabled={btnLoading}>
          {I18n.t('reg')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1, //backgroundColor: "#336082",
  },
  heading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  input1: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('25%'),
    alignSelf: 'center', // paddingTop: RFValue(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  register: {
    textAlign: 'center',
    marginHorizontal: 10,
    fontSize: 30,
    textTransform: 'uppercase',
    color: 'black',
    paddingVertical: 20,
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  form: {
    paddingHorizontal: 15,
  },
  mobile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  codeContainer: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  mobileIcon: {
    alignSelf: 'center',
    marginLeft: 15,
  },
  number: {
    width: '55%',
    backgroundColor: Colors.white,
  },
  dropDownStyles: {
    flexDirection: 'row',
  },
  earth: {
    paddingTop: 3,
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  text_start: {
    paddingLeft: 40,
    paddingTop: 8,
    color: Colors.primary,
  },
  text_expire: {
    marginRight: 45,
    paddingTop: 8,
    color: Colors.primary,
  },
  dateContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 12,
    paddingTop: 10,
    width: '45%',
    borderBottomColor: '#bdbdbd',
  }, ////
  selectedTextStyle: {
    borderColor: 'gray',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    color: 'black',
    fontSize: 15,
    paddingLeft: 10,
  },
  listTextStyle: {
    color: '#000',
    marginVertical: 10,
    flex: 0.9,
    marginLeft: 20,
    marginHorizontal: 10,
    textAlign: 'left',
  },
  searchBarStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: 40,
    shadowRadius: 1,
    shadowOpacity: 1.0,
    borderWidth: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderColor: '#303030',
    shadowColor: '#303030',
    borderRadius: 5,
    elevation: 1,
    marginHorizontal: 10,
  },
  placeHolderTextStyle: {
    padding: 10,
    textAlign: 'left',
    width: '80%',
    flexDirection: 'row',
  },
  dropDownIconStyle: {
    width: 12,
    height: 12,
    left: -20,
  },
  pickerStyle: {
    height: 30,
    width: '95%',
  },
});

export default RegisterForm;

