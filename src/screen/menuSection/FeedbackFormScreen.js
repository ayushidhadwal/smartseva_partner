import React, {useCallback, useEffect, useState} from 'react';
import {Text, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import Colors from '../../constant/Colors';
import * as userActions from '../../store/actions/user';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';

const FeedbackFormScreen = ({route, navigation}) => {
  const {bookingId, complaintId} = route.params;
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const _submitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(userActions.postFeedback(bookingId, complaintId, comment));
      Alert.alert('Alert', 'Sent Successfully !!!', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [bookingId, complaintId, comment]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView showsverticalscrollindicator={false}>
        <Text style={styles.heading}>{I18n.t('postFeedback')}:</Text>
        <TextInput
          mode={'outlined'}
          numberOfLines={15}
          multiline
          value={comment}
          onChangeText={text => setComment(text)}
        />
        <Button
          mode={'contained'}
          style={styles.btn}
          loading={loading}
          disabled={loading}
          onPress={() => _submitHandler()}>
          {I18n.t('submitBtn')}
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(20),
  },
  heading: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  btn: {
    width: '40%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
    borderRadius: 50,
  },
});

export default FeedbackFormScreen;
