import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, I18nManager, StyleSheet, View} from 'react-native';
import {Button, TextInput, Chip, ActivityIndicator} from 'react-native-paper';
import Colors from '../../constant/Colors';
// import RNPicker from 'rn-modal-picker';
import * as requestAction from '../../store/actions/request';
import RFValue from '../../../rfvalue';

const AddServiceScreen = ({navigation}) => {
  const [serviceId, setServiceId] = useState(0);
  const [service, setService] = useState(0);
  const [subServiceId, setSubserviceId] = useState(0);
  const [serviceName, setServiceName] = useState('');
  const [subServiceName, setSubserviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [serviceloading, setServiceLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subServices, setSubServices] = useState([]);
  const [service_price, setServicePrice] = useState('');
  const [service_desc, setServiceDesc] = useState('');

  const dispatch = useDispatch();
  const {selectService, subServiceList} = useSelector(state => state.request);

  useEffect(() => {
    setSubServices(
      subServiceList.map(subdata => ({
        id: subdata.id,
        name:
          subdata.child_cat === null
            ? subdata.subcategory_name
            : `${subdata.subcategory_name} ${' - ' + subdata.child_cat} `,
      })),
    );
  }, [subServiceList]);

  const selectedValue1 = item => {
    setServiceName(item.name);
    setSubserviceName('');
    setServiceId(item.id);
    setService(item.id);
    subsetService(item.id);
  };

  const selectedValue = item => {
    setSubserviceName(item.name);
    setSubserviceId(item.id);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.get_selected_service());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  const subsetService = useCallback(async service => {
    if (!service || service === 0 || service === null) {
      return;
    }
    setServiceLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.get_subservice_by_service(service));
    } catch (e) {
      setError(e.message);
    }
    setServiceLoading(false);
  }, []);

  const onclickHandler = useCallback(async () => {
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(service_price)) {
      setError('Price must be Number');
      return;
    }
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.add_service_pricing(
          service,
          service_price,
          service_desc,
          subServiceId,
        ),
      );
      setBtnLoading(false);
      Alert.alert('Alert', 'Successfully Added !!!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      setError(e.message);
      setBtnLoading(false);
    }
  }, [service, service_price, service_desc, subServiceId]);

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
      <>
        {/*<RNPicker*/}
        {/*  data={selectService.map(d => ({*/}
        {/*    id: d.service_id,*/}
        {/*    name: d.service_name,*/}
        {/*  }))}*/}
        {/*  showSearchBar={true}*/}
        {/*  showPickerTitle={true}*/}
        {/*  listTextStyle={styles.listTextStyle}*/}
        {/*  pickerStyle={styles.pickerStyle1}*/}
        {/*  selectedText={serviceName}*/}
        {/*  placeHolderText={'Select Service'}*/}
        {/*  searchBarPlaceHolder={'Search.....'}*/}
        {/*  searchBarPlaceHolderColor={'#9d9d9d'}*/}
        {/*  selectedTextStyle={styles.selectedTextStyle}*/}
        {/*  placeHolderTextColor={'gray'}*/}
        {/*  dropDownIconStyle={styles.dropDownIconStyle}*/}
        {/*  searchBarStyle={styles.searchBarStyle}*/}
        {/*  selectedValue={(index, item) => selectedValue1(item)}*/}
        {/*/>*/}

        {serviceloading ? (
          <ActivityIndicator
            color={Colors.primary}
            style={{
              borderBottomWidth: RFValue(0.8),
              paddingVertical: RFValue(15),
              marginHorizontal: RFValue(20),
              borderColor: '#c2c2c2',
              backgroundColor: 'transparent',
            }}
          />
        ) : (
          <RNPicker
            data={subServices}
            showSearchBar={true}
            showPickerTitle={true}
            listTextStyle={styles.listTextStyle}
            pickerStyle={styles.pickerStyle2}
            selectedText={subServiceName}
            placeHolderText={'Service Offered'}
            searchBarPlaceHolder={'Search.....'}
            searchBarPlaceHolderColor={'#9d9d9d'}
            selectedTextStyle={styles.selectedTextStyle}
            placeHolderTextColor={'gray'}
            dropDownIconStyle={styles.dropDownIconStyle}
            searchBarStyle={styles.searchBarStyle}
            selectedValue={(index, item) => selectedValue(item)}
            disablePicker={!service}
          />
        )}

        <TextInput
          label="Price Offered"
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          style={styles.input}
          value={service_price}
          onChangeText={text => setServicePrice(text)}
          keyboardType="numeric"
        />
        <TextInput
          label="Description of Service"
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          style={styles.input}
          value={service_desc}
          onChangeText={text => setServiceDesc(text)}
        />
        <Button
          mode="outlined"
          icon="check"
          onPress={onclickHandler}
          style={{
            alignSelf: 'center',
          }}
          loading={btnLoading}
          disabled={btnLoading}>
          Save
        </Button>
        {serviceId ? (
          <Chip icon="check-decagram" mode="outlined" style={styles.chipStyle}>
            {serviceName}
          </Chip>
        ) : null}
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    justifyContent: 'space-between',
  },
  input: {
    width: '87%',
    alignSelf: 'center',
    marginBottom: RFValue(15),
    backgroundColor: Colors.white,
  },
  chipStyle: {
    marginVertical: RFValue(20),
    alignSelf: 'center',
  },
  ////
  selectedTextStyle: {
    borderColor: 'gray',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    color: 'black',
    fontSize: RFValue(15),
    paddingLeft: 10,
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
  pickerStyle1: {
    height: RFValue(56),
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    width: '95%',
    alignSelf: 'center',
  },
  pickerStyle2: {
    height: RFValue(56),
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    width: '95%',
    alignSelf: 'center',
    marginTop: RFValue(-15),
  },
});

export default AddServiceScreen;
