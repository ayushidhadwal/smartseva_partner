import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, StatusBar, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Colors from '../../constant/Colors';
import RegisterForm from '../../components/RegisterForm';
import * as authActions from '../../store/actions/auth';
import {useDispatch} from 'react-redux';

const RegisterScreen = props => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.setStates());
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getStates);

    return () => unsubscribe;
  }, [getStates, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{backgroundColor: Colors.white}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.primary}
        />
        <RegisterForm {...props} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});

export default RegisterScreen;
