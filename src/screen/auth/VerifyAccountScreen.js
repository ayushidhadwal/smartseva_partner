import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Alert,
  I18nManager,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import {Button, TextInput} from 'react-native-paper';

import * as authActions from '../../store/actions/auth';
import Colors from '../../constant/Colors';
import I18n from '../../languages/I18n';

const VerifyAccountScreen = () => {
  const dispatch = useDispatch();
  const {register} = useSelector(state => state.auth);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(120);
  const [verificationType, setVerificationType] = useState('EMAIL');

  useEffect(() => {
    (async () => {
      if (!register.emailVerified) {
        setOtp('');
        setVerificationType('EMAIL');
      } else if (!register.mobileVerified) {
        setOtp('');
        setVerificationType('MOBILE');
      }
    })();
  }, [register]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimer(prevState => {
        const time = prevState;
        if (time > 0) {
          return time - 1;
        } else {
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const _resendOTP = useCallback(async () => {
    setTimer(120);
    setError(null);
    try {
      if (verificationType === 'EMAIL') {
        await dispatch(authActions.resendRegistrationEmailOtp(register.email));
      } else {
        await dispatch(
          authActions.resendRegistrationMobileOtp(register.mobile),
        );
      }
    } catch (e) {
      setError(e.message);
    }
  }, [register]);

  const _verifyHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (verificationType === 'EMAIL') {
        await dispatch(authActions.verifyUserEmail(register.email, otp));
      } else {
        await dispatch(
          authActions.verifyUserMobile(register.mobileNumber, otp),
        );
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [otp, register]);

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
        bounces={false}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
        <View style={styles.container}>
          <View
            style={{
              marginTop: 50,
              alignItems: 'center',
            }}>
            <Text style={styles.heading}>
              {verificationType === 'EMAIL'
                ? I18n.t('emailVerify')
                : I18n.t('mobVerify')}
            </Text>
            <Text style={styles.heading2}>
              {/* We have sent you a 6-digit Verification code
               */}
              {I18n.t('otpMsg')}
            </Text>
            <Text style={styles.heading3}>
              {verificationType === 'EMAIL'
                ? register.email.toLowerCase()
                : register.mobile}
            </Text>
          </View>
          <View style={styles.OTPcontainer}>
            <TextInput
              left={<TextInput.Icon name="lock" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={I18n.t('otp')}
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              keyboardType="number-pad"
            />
            <Text
              style={{
                marginTop: 10,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {I18n.t('otpErrMsg')}{' '}
              {timer === 0 ? (
                <Text onPress={_resendOTP} style={{color: Colors.primary}}>
                  Resend OTP
                </Text>
              ) : (
                <Text style={{color: Colors.primary}}>
                  {I18n.t('otpResend')} {timer}
                </Text>
              )}
            </Text>
          </View>
          <Button
            mode="contained"
            style={styles.btn}
            contentStyle={{paddingVertical: 10}}
            onPress={_verifyHandler}
            disabled={loading}
            loading={loading}>
            {I18n.t('verifyBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  heading: {
    fontSize: 19,
    color: Colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 25,
  },
  heading2: {
    fontSize: 14,
    color: Colors.grey,
    marginVertical: 8,
    textAlign: 'center',
  },
  heading3: {
    fontSize: 14,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  btn: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 30,
  },
  OTPcontainer: {
    // justifyContent: "center",
    // alignItems: "center",
    marginVertical: 25,
  },
  roundedTextInput: {
    borderWidth: 4,
  },
  timer: {
    color: Colors.grey,
    textAlign: 'center',
    fontSize: 15,
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default VerifyAccountScreen;
