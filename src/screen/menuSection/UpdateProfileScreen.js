import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Alert,
  Pressable,
  Modal,
  Platform,
  Linking,
  I18nManager,
  Text,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput} from 'react-native-paper';
import RFValue from '../../../rfvalue';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import ImageViewer from 'react-native-image-zoom-viewer';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useReverseGeocoding} from '../../hooks/useReverseGeocoding';
import Colors from '../../constant/Colors';
import * as userActions from '../../store/actions/user';
import * as authActions from '../../store/actions/auth';
import {IMG_URL} from '../../constant/base_url';
import I18n from '../../languages/I18n';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import {SearchableDropdown} from '../../components/SearchableDropdown';

const UpdateProfileScreen = ({navigation, route}) => {
  const {partner} = useSelector(state => state.user);
  const {cities, states} = useSelector(state => state.auth);
  const [img, setImg] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [overview, setOverview] = useState('');

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);
  const [error, setError] = useState(null);

  const [location, setLocation] = useState({
    lat: '',
    long: '',
  });
  const [radius, setRadius] = useState('1');
  const [image, setImage] = useState({
    name: '',
    uri: '',
    type: '',
  });

  const latitude = route.params.lat;
  const longitude = route.params.long;
  const geoAddress = useReverseGeocoding(latitude, longitude);

  const dispatch = useDispatch();

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
  }, [dispatch, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setStateLoading(true);
      setError(null);
      try {
        await dispatch(authActions.setStates());
      } catch (e) {
        setError(e.message);
      }
      setStateLoading(false);
    });

    return () => unsubscribe;
  }, [dispatch, navigation]);

  const getCity = useCallback(async () => {
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
  }, [state, dispatch]);

  useEffect(() => {
    getCity();
  }, [getCity]);

  useEffect(() => {
    setFirstName(partner.firstname);
    setLastName(partner.lastname);
    setAddress(route.params.code === 'map' ? geoAddress[0] : partner.address);
    setCompanyName(partner.company_name);
    setOverview(partner.experience_text);
    setRadius(partner.vendor_radius);
    setState(partner.state);
    setCity(partner.city);
    setLocation({
      lat: route.params.code === 'map' ? latitude : partner.latitude,
      long: route.params.code === 'map' ? longitude : partner.longitude,
    });
  }, [partner]);

  const onClickHandler = useCallback(async () => {
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(
        userActions.updateProfile(
          firstName,
          lastName,
          address,
          state,
          city,
          companyName,
          overview,
          radius,
          location.lat,
          location.long,
        ),
      );
      Alert.alert('Alert', 'Successfully Updated!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      setError(e.message);
      setBtnLoading(false);
    }
    setBtnLoading(false);
  }, [
    dispatch,
    firstName,
    lastName,
    address,
    state,
    city,
    companyName,
    overview,
    radius,
    location.lat,
    location.long,
    navigation,
  ]);


  const _openImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      let img = {
        name: '',
        uri: '',
        type: '',
      };
      if ('assets' in result) {
        result.assets.forEach(asset => {
          img = {
            name: asset.fileName,
            uri: asset.uri,
            type: asset.type,
          };
          setImage(img);
        });
        await dispatch(userActions.updatePicture(img));
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const imgClickHandler = () => {
    setImg(true);
  };

  const images = [
    {
      url: image ? image : IMG_URL + partner.photo,
    },
  ];

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const onSelectState = value => {
    setState(value);
    setCity('');
  };

  const onSelectCity = value => {
    setCity(value);
  };

  if (loading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView>
        {imgLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.imgContainer}
          />
        ) : (
          <Pressable
          // onPress={imgClickHandler}
          >
            <View style={styles.imgContainer}>
              <Image
                source={{
                  uri: image.uri ? image.uri : IMG_URL + partner.photo,
                }}
                style={styles.img}
              />
              <Feather
                name="edit"
                size={24}
                color={Colors.primary}
                style={styles.edit}
                onPress={_openImagePicker}
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
        )}
        <View style={{alignItems: 'flex-end'}}>
          <Pressable
            //onPress={() => requestForLocationPermission()}
            onPress={() =>
              navigation.navigate('Map', {
                latitude: location.lat,
                longitude: location.long,
              })
            }
            style={{alignItems: 'center', flexDirection: 'row'}}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text
              style={{
                color: Colors.primary,
                fontWeight: 'bold',
                marginRight: 10,
              }}>
              Want to Change Location
            </Text>
          </Pressable>
        </View>
        <View style={{flex: 1, margin: RFValue(15)}}>
          <View style={styles.rowStyle}>
            <TextInput
              left={<TextInput.Icon name="account" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('fname')}
              style={styles.input}
              value={firstName}
              onChangeText={text => setFirstName(text)}
            />
            <TextInput
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('lname')}
              style={styles.input}
              value={lastName}
              onChangeText={text => setLastName(text)}
            />
          </View>
          <TextInput
            left={
              <TextInput.Icon name="home-map-marker" color={Colors.primary} />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('statusAddress')}
            style={styles.input1}
            value={address}
            onChangeText={text => setAddress(text)}
          />

          <View style={styles.pickerContainer}>
            <Ionicons
              name="map-outline"
              size={24}
              color={Colors.primary}
              style={styles.earth}
            />

            <Picker
              style={styles.pickerStyle}
              selectedValue={`${radius}`}
              onValueChange={(itemValue, itemIndex) => setRadius(itemValue)}>
              <Picker.Item label="5KM" value="5" />
              <Picker.Item label="10KM" value="10" />
              <Picker.Item label="15KM" value="15" />
              <Picker.Item label="20KM" value="20" />
              <Picker.Item label="25KM" value="25" />
              <Picker.Item label="30KM" value="30" />
              <Picker.Item label="35KM" value="35" />
              <Picker.Item label="40KM" value="40" />
              <Picker.Item label="45KM" value="45" />
              <Picker.Item label="50KM" value="60" />
            </Picker>
          </View>

          <SearchableDropdown
            label={'Select State'}
            data={states.map(m => ({
              name: m.name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={state}
            onSelectValue={onSelectState}
          />
          <SearchableDropdown
            label={'Select City'}
            data={cities.map(m => ({
              name: m.name,
              key: m.id,
              value: m.id,
            }))}
            selectedValue={city}
            onSelectValue={onSelectCity}
          />
          <TextInput
            left={<TextInput.Icon name="earth" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={'Pincode'}
            style={styles.input1}
            // value={companyName}
            // onChangeText={text => setCompanyName(text)}
          />
          <TextInput
            left={
              <TextInput.Icon name="office-building" color={Colors.primary} />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('compName')}
            style={styles.input1}
            value={companyName}
            onChangeText={text => setCompanyName(text)}
          />
          <TextInput
            left={
              <TextInput.Icon name="account-details" color={Colors.primary} />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={I18n.t('overview')}
            style={styles.input1}
            value={overview}
            onChangeText={text => setOverview(text)}
          />
          <Button
            mode="contained"
            style={{
              width: '60%',
              marginVertical: RFValue(30),
              alignSelf: 'center',
            }}
            onPress={onClickHandler}
            loading={btnLoading}
            disabled={btnLoading}>
            {I18n.t('updBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: Colors.white,
    width: '48%',
  },
  input1: {
    backgroundColor: Colors.white,
  },
  edit: {
    position: 'absolute',
    margin: RFValue(10),
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
    padding: RFValue(10),
    borderRadius: RFValue(100),
  },
  imgContainer: {
    width: '100%',
    height: heightPercentageToDP('20%'),
    marginBottom: RFValue(20),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  ////
  selectedTextStyle: {
    borderColor: 'gray',
    backgroundColor: 'transparent',
    color: 'black',
    fontSize: RFValue(13),
    // paddingLeft: 10,
    // flexWrap:'nowrap'
  },
  listTextStyle: {
    color: '#000',
    marginVertical: RFValue(10),
    flex: 0.9,
    marginLeft: RFValue(20),
    marginHorizontal: RFValue(10),
    textAlign: 'left',
  },
  searchBarStyle: {
    marginBottom: 10,
    flexDirection: 'row',
    height: RFValue(40),
    shadowRadius: 1,
    shadowOpacity: 1.0,
    borderWidth: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    borderColor: '#303030',
    shadowColor: '#303030',
    borderRadius: RFValue(5),
    elevation: 1,
    marginHorizontal: RFValue(10),
  },
  placeHolderTextStyle: {
    padding: RFValue(10),
    textAlign: 'left',
    width: '80%',
    flexDirection: 'row',
  },
  dropDownIconStyle: {
    width: RFValue(12),
    height: RFValue(12),
    left: -20,
  },
  pickerStyle: {
    height: RFValue(25),
    width: '95%',
  },
  //
  pickerContainer: {
    flexDirection: 'row',
    // marginHorizontal: RFValue(10),
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
  },
  earth: {
    paddingTop: RFValue(18),
    marginLeft: RFValue(12),
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UpdateProfileScreen;
