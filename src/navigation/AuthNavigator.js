import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screen/auth/LoginScreen';
import RegisterScreen from '../screen/auth/RegisterScreen';
import OTPScreen from '../screen/auth/OTPScreen';
import ForgotPassword from '../screen/auth/ForgotPassword';
import ResetPassword from '../screen/auth/ResetPassword';
import CategoryScreen from '../screen/skillQuestion/CategoryScreen';
import AgeScreen from '../screen/skillQuestion/AgeScreen';
import SalaryScreen from '../screen/skillQuestion/SalaryScreen';
import ExperienceScreen from '../screen/skillQuestion/ExperienceScreen';
import FinalAnsScreen from '../screen/skillQuestion/FinalAnsScreen';
import VerifyAccountScreen from '../screen/auth/VerifyAccountScreen';
import I18n from '../languages/I18n';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Map">

      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{ title: null, headerBackTitle: null }}
      />
      <Stack.Screen
        name="forgot"
        component={ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="reset"
        component={ResetPassword}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="category"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="age"
        component={AgeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="salary"
        component={SalaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="experience"
        component={ExperienceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="final"
        component={FinalAnsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyAccount"
        component={VerifyAccountScreen}
        options={{
          title: I18n.t('accVerify'),
          headerLeft: null,
        }}
      />

    </Stack.Navigator>
  );
};

export default AuthNavigator;
