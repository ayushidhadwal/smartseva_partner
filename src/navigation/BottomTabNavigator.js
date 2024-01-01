import React, {useEffect} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
// import {FontAwesome, MaterialIcons, Ionicons} from '@expo/vector-icons';

import NewLeadsScreen from '../screen/bottomTabs/NewLeadsScreen';
import BookingScreen from '../screen/bottomTabs/BookingScreen';
import MenuScreen from '../screen/bottomTabs/MenuScreen';
import Colors from '../constant/Colors';
import JobHistoryScreen from '../screen/bottomTabs/JobHistoryScreen';
import I18n from '../languages/I18n';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopTabNavigator from './TopTabNavigator'
// import * as Notifications from 'expo-notifications';
// import {CommonActions} from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = ({navigation}) => {
  // const response = useLastNotificationResponse();
  //
  // useEffect(() => {
  //   if (
  //     response &&
  //     response.notification.request.content.data.screen &&
  //     response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
  //   ) {
  //     const {screen, params} = response.notification.request.content.data;
  //     navigation.dispatch(
  //       CommonActions.navigate({
  //         name: screen,
  //         params: params,
  //       }),
  //     );
  //   }
  // }, [response]);

  return (
    <Tab.Navigator
      initialRouteName="New"
      shifting={false}
      backBehavior={'initialRoute'}
      barStyle={{backgroundColor: Colors.primary}}>
      <Tab.Screen
        name="newlead"
        component={NewLeadsScreen}
        options={{
          tabBarLabel: I18n.t('newBottomTab'),
          tabBarIcon: tabInfo => (
            <MaterialIcons name="fiber-new" size={24} color={tabInfo.color} />
          ),
        }}
      />
       <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          tabBarLabel: I18n.t('bookBottomTab'),
          tabBarIcon: tabInfo => {
            return <FontAwesome name="bars" size={24} color={tabInfo.color} />;
          },
        }}
      />
      <Tab.Screen
        name="TopTab"
        component={TopTabNavigator}
        options={{
          tabBarLabel:"Decline List",
            header:'',
          tabBarIcon: tabInfo => {
            return (
              <FontAwesome name="history" size={24} color={tabInfo.color} />
            );
          },
        }}
      />
      <Tab.Screen
        name="menu"
        component={MenuScreen}
        options={{
          tabBarLabel: I18n.t('settingBottomTab'),
          tabBarIcon: tabInfo => (
            <Ionicons name="settings" size={25} color={tabInfo.color} />
          ),
        }}
      /> 
    </Tab.Navigator>
  );
};
export default BottomTabNavigator;
