import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import NewLeadsScreen from '../screen/bottomTabs/NewLeadsScreen';
import BookingScreen from '../screen/bottomTabs/BookingScreen';
import MenuScreen from '../screen/bottomTabs/MenuScreen';
import PendingDeclineRequestScreen from '../screen/PendingDeclineRequestScreen';
import AcceptedDeclineRequestScreen from '../screen/AcceptedDeclineRequestScreen';
import RejectedDeclineRequestScreen from '../screen/RejectedDeclineRequestScreen';

import {Dimensions} from 'react-native';

const Tab = createMaterialTopTabNavigator();

export const tabScreenOptions = {
  swipeEnabled: true,
  lazy: true,
  tabBarActiveTintColor: 'black',
  // tabBarLabelStyle: {
  //     fontWeight: 'bold',
  //     fontFamily: 'Roboto-Regular',
  //     textTransform: 'capitalize',
  //     fontSize: RFValue(14),
  // },
  tabBarIndicatorStyle: {
    borderBottomWidth: 2,
    borderColor: '#f5b942',
  },
  tabBarItemStyle: {},
  tabBarScrollEnabled: true,
};

const TopTabNavigator = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen
      name="Pending"
      component={PendingDeclineRequestScreen}
      options={{tabBarLabel: 'Pending'}}
    />
    <Tab.Screen
      name="Rejected"
      component={AcceptedDeclineRequestScreen}
      options={{tabBarLabel: 'Rejected'}}
    />
    <Tab.Screen
      name="Accepted"
      component={RejectedDeclineRequestScreen}
      options={{tabBarLabel: 'Accepted'}}
    />
  </Tab.Navigator>
);

export default TopTabNavigator;
