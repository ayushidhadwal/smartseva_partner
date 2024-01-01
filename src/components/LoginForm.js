import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Image, Text} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {I18nManager} from 'react-native';

import Colors from '../constant/Colors';
import * as authActions from '../store/actions/auth';
import I18n from '../languages/I18n';

const LoginForm = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const {register} = useSelector(state => state.auth);

  useEffect(() => {
    if (
      (!register.mobileVerified || !register.emailVerified) &&
      register.userId
    ) {
      props.navigation.navigate('VerifyAccount');
    }
  }, [register]);

  const loginHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.login({email, password}));
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [email, password]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);

  const {local} = useSelector(state => state.lang);
  I18n.locale = local;

  return (
    <View style={styles.screen}>
      <View style={styles.imgContainer}>
        <Image source={require('../assets/icon.png')} style={styles.logoImg} />
      </View>

      <Title style={styles.title}>{I18n.t('title')}</Title>

      <View style={styles.form}>
        <TextInput
          left={<TextInput.Icon name="email" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('email')}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          activeUnderlineColor={Colors.primary}
        />
        <TextInput
          left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={I18n.t('password')}
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          activeUnderlineColor={Colors.primary}
        />
        <Button
          mode="contained"
          style={styles.btn}
          labelStyle={{paddingVertical: 2}}
          contentStyle={{height: 50}}
          onPress={loginHandler}
          loading={loading}
          disabled={loading}>
          {I18n.t('btn')}
        </Button>
        <Text
          style={styles.forgot}
          onPress={() => props.navigation.navigate('forgot')}>
          {I18n.t('forgot')}
        </Text>

        <Text style={styles.account}>{I18n.t('dont')}</Text>
        <Text
          style={styles.signUp}
          onPress={() => props.navigation.navigate('Register')}>
          {I18n.t('reg')}
        </Text>
      </View>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 15,
  },
  imgContainer: {
    width: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('25%'),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    textTransform: 'uppercase',
    color: 'black',
    marginHorizontal: 10,
    alignSelf: 'center',
    paddingTop: 30,
    paddingBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btn: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    marginTop: 10,
  },
  forgot: {
    color: Colors.black,
    paddingVertical: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  signUp: {
    color: Colors.black,
    paddingTop: 5,
    marginBottom: 16,
    alignSelf: 'center',
    //textDecorationLine: "underline",
    fontWeight: 'bold',
    fontSize: 18,
  },
  account: {
    color: Colors.black,
    paddingTop: 30,
    alignSelf: 'center',
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 15,
  },
  input: {
    color: 'black',
    marginBottom:20,
    backgroundColor: 'white',
  },
});
