import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Button, TextInput, Checkbox} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {IMG_URL} from '../../constant/base_url';
import Colors from '../../constant/Colors';
import * as requestAction from '../../store/actions/request';
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

const BankDetailScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [screenloading, setScreenLoading] = useState(false);
  const [error, setError] = useState(null);

  const [bankName, setBankName] = useState('');
  const [account, setAccount] = useState(0);
  const [accountType, setAccountType] = useState('');
  const [confirmAccount, setConfirmAccount] = useState(0);
  const [iBan, setIBan] = useState('');
  const [image, setImage] = useState({
    name: '',
    type: '',
    uri: '',
  });
  const [image1, setImage1] = useState(null);
  const [saving, setSaving] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  const dispatch = useDispatch();
  const {bank} = useSelector(state => state.request);

  useEffect(() => {
    setBankName(bank.bank_name);
    setAccount(bank.bank_account_number);
    setConfirmAccount(bank.bank_account_number);
    setSaving(bank.account_type);
    setIBan(bank.iban);
    setImage1(bank.cancel_cheque);
  }, [bank]);

  const onclickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.updateBankDetails(
          bankName,
          account,
          confirmAccount,
          saving,
          iBan,
          !image.uri ? IMG_URL + image1 : image,
        ),
      );
      Alert.alert('Alert Title', 'Updated Successfully !!!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [bankName, account, iBan, image]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setScreenLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getBankDetails());
      } catch (e) {
        setError(e.message);
      }
      setScreenLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

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
          <Text style={styles.label}>{I18n.t('bankName')}</Text>
          <Text style={{color: Colors.grey}}>{I18n.t('bankNameMsg')}</Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={bankName}
            onChangeText={setBankName}
          />
          <Text style={styles.label}>Bank Acount Type</Text>
          <Text style={{color: Colors.grey}}>
            Please update your account type
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row'}}>
              <Checkbox
                status={saving === 'saving' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setSaving('saving');
                }}
                color={Colors.darkYellow}
              />
              <Text style={{marginLeft: RFValue(10), marginTop: RFValue(8)}}>
                Saving
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Checkbox
                status={saving === 'current' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setSaving('current');
                }}
                color={Colors.darkYellow}
              />
              <Text style={{marginLeft: RFValue(10), marginTop: RFValue(8)}}>
                Current
              </Text>
            </View>
          </View>

          <Text style={styles.label}>{I18n.t('bankAccNo')}</Text>
          <Text style={{color: Colors.grey}}>{I18n.t('bankAccNoMsg')}</Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={account}
            onChangeText={setAccount}
          />
          <Text style={styles.label}>Confirm {I18n.t('bankAccNo')}</Text>
          <Text style={{color: Colors.grey}}>
            Please Confirm Your Account Number
          </Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={confirmAccount}
            onChangeText={setConfirmAccount}
          />
          <Text style={styles.label}>{I18n.t('iban')}</Text>
          <Text style={{color: Colors.grey}}>{I18n.t('ibanMsg')}</Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input2}
            value={iBan}
            onChangeText={setIBan}
          />
        </View>
        <View style={styles.nameContainer1}>
          <Text style={styles.label}>{I18n.t('cancelCheque')}</Text>
          <Text style={{color: Colors.grey}}>{I18n.t('cancelChequeMsg')}</Text>
          <Button
            mode="outlined"
            icon="plus-box"
            style={{marginTop: RFValue(15), width: '45%'}}
            onPress={_pickImageHandler}>
            {I18n.t('addImg')}
          </Button>
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
            onPress={onclickHandler}
            loading={loading}
            disabled={loading}
            style={{alignSelf: 'center', marginTop: RFValue(15)}}>
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
  nameContainer: {
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
    marginBottom: RFValue(10),
    backgroundColor: Colors.white,
  },
  nameContainer1: {
    padding: RFValue(20),
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  input1: {
    marginBottom: RFValue(15),
  },
  input2: {
    marginBottom: RFValue(20),
  },
});

export default BankDetailScreen;
