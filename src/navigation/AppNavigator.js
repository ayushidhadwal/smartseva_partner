import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, ActivityIndicator} from 'react-native';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {I18nManager} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import RootStack from './RootStack';
import AuthNavigator from './AuthNavigator';
import * as authActions from '../store/actions/auth';
import Colors from '../constant/Colors';
import I18n from '../languages/I18n';

import {SESSION_ID} from '../store/actions/auth';
import {arabic_lang, english_lang} from '../store/actions/lang';
import { registerNotification } from '../lib/Notifee';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {user_id} = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const id = await AsyncStorage.getItem(SESSION_ID);
      I18n.locale = await AsyncStorage.getItem('local');
      await dispatch(authActions.setStates());

      if (id) {
        dispatch(authActions.auth(id));
      }

      if (I18n.locale === 'ar') {
        I18nManager.forceRTL(true);
        dispatch(arabic_lang());
      } else {
        I18nManager.forceRTL(false);
        dispatch(english_lang());
      }

      setIsLoading(false);
      SplashScreen.hide();
      registerNotification()
    })();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      {user_id ? <RootStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
export default AppNavigator;
