import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Text, Alert, Platform, Linking} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as requestAction from '../store/actions/request';
import Colors from '../constant/Colors';
import I18n from '../languages/I18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Picker} from '@react-native-picker/picker';
import RFValue from '../../rfvalue';

const HelpScreen = ({navigation}) => {
  const [comment, setComment] = useState('');
  const [image, setImage] = useState({
    name: '',
    uri: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaint, setComplaint] = useState('');

  const dispatch = useDispatch();
  const {complaintList} = useSelector(state => state.request);

  const getComplaintTypes = useCallback(async () => {
    try {
      await dispatch(requestAction.getComplaintTypes());
    } catch (e) {
      setError(e.message);
    }
  }, [dispatch]);

  useEffect(() => {
    getComplaintTypes();
  }, [getComplaintTypes]);

  const onclickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(requestAction.help(complaint, comment, image));
      setLoading(false);
      Alert.alert('Alert', 'Sent Successfully!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [comment, complaint, dispatch, image, navigation]);

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

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Title style={styles.heading}>{I18n.t('helpScreen')}</Title>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>Complaint Type</Text>
        <View style={styles.pickerStyle}>
          <Picker
            selectedValue={complaint}
            onValueChange={(itemValue, itemIndex) => setComplaint(itemValue)}>
            {complaintList.length > 0
              ? complaintList.map((complaints, index) => (
                  <Picker.Item
                    key={index}
                    label={complaints.Complaints}
                    value={complaints.Complaints}
                  />
                ))
              : []}
          </Picker>
        </View>

        <TextInput
          mode="outlined"
          label={I18n.t('helpTextLabel')}
          style={styles.input}
          multiline
          numberOfLines={10}
          value={comment}
          onChangeText={text => setComment(text)}
        />

        {image.uri ? (
          <View style={styles.rowStyle}>
            <Text style={styles.text}>{I18n.t('helpUploadText')}</Text>
            <Ionicons name="checkmark-done" size={24} color={Colors.primary} />
          </View>
        ) : null}
        <Button
          mode="contained"
          style={styles.submit}
          onPress={onclickHandler}
          loading={loading}
          disabled={loading}>
          {I18n.t('submitBtn')}
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(15),
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: RFValue(40),
  },
  heading: {
    marginBottom: RFValue(15),
    fontWeight: 'bold',
  },
  attachment: {
    alignSelf: 'center',
    marginVertical: RFValue(15),
    borderRadius: RFValue(100),
    width: '60%',
  },
  submit: {
    width: '90%',
    borderRadius: RFValue(10),
    alignSelf: 'center',
    marginVertical: RFValue(15),
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: RFValue(10),
  },
  text: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  pickerStyle: {
    borderWidth: 2,
    borderColor: '#cccccc',
    marginVertical: 10,
  },
});

export default HelpScreen;
