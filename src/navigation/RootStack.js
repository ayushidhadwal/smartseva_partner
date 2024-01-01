import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {Text, View, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constant/Colors';
import NotifyScreen from '../screen/NotifyScreen';
import BottomTabNavigator from './BottomTabNavigator';
import AccountDetailScreen from '../screen/menuSection/AccountDetailScreen';
import ReferScreen from '../screen/menuSection/ReferScreen';
import TradeScreen from '../screen/menuSection/TradeScreen';
import TXNScreen from '../screen/menuSection/TXNScreen';
import BankDetailScreen from '../screen/menuSection/BankDetailScreen';
import AddServiceScreen from '../screen/menuSection/AddServiceScreen';
import HelpScreen from '../screen/HelpScreen';
import StatusScreen from '../screen/StatusScreen';
import SecurityScreen from '../screen/menuSection/SecurityScreen';
import ProfileDetails from '../screen/menuSection/ProfileDetails';
import ServicesScreen from '../screen/menuSection/ServicesScreen';
import BookingStatusScreen from '../screen/BookingStatusScreen';
import ServicePriceScreen from '../screen/menuSection/ServicePriceScreen';
import WalletScreen from '../screen/WalletScreen';
import TransactionScreen from '../screen/menuSection/TransactionScreen';
import UpdateProfileScreen from '../screen/menuSection/UpdateProfileScreen';
import CategoryScreen from '../screen/menuSection/CategoryScreen';
import GalleryScreen from '../screen/menuSection/GalleryScreen';
import RechargeScreen from '../screen/RechargeScreen';
import PaymentScreen from '../screen/PaymentScreen';
// import ImageBrowserScreen from '../screen/menuSection/ImageBrowserScreen';
import UserComplaintScreen from '../screen/menuSection/UserComplaintScreen';
import FeedbackFormScreen from '../screen/menuSection/FeedbackFormScreen';
import CalenderScreen from '../screen/menuSection/CalenderScreen';
import MessageScreen, {
  screenOptions as messageScreenOptions,
} from '../screen/MessageScreen';
import WithdrawalScreen from '../screen/menuSection/WithdrawalScreen';
import HistoryStatusScreen from '../screen/HistoryStatusScreen';
import InvoiceScreen from '../screen/InvoiceScreen';
import MyReviewScreen from '../screen/menuSection/MyReviewScreen';
import AllPlanScreen from '../screen/subscriptionPlan/AllPlanScreen';
import PlanPaymentScreen from '../screen/subscriptionPlan/PlanPaymentScreen';
import JobHistoryScreen from '../screen/bottomTabs/JobHistoryScreen';
import UserComplaintDetailScreen from '../screen/UserComplaintDetailScreen';
import MapScreen from '../screen/MapScreen';
import ChangeLocationScreen from '../screen/ChangeLocationScreen';

import I18n from '../languages/I18n';
import RFValue from '../../rfvalue';

const Stack = createStackNavigator();

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'newlead';

  switch (routeName) {
    case 'bottomTabs':
      return I18n.t('newScreenTitle');
    case 'newlead':
      return I18n.t('newScreenTitle');
    case 'Booking':
      return I18n.t('bookScreenTitle');
    case 'TopTab':
      return 'Booking Status';
    case 'menu':
      return I18n.t('settingScreenTitle');
  }
}

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="bottomTabs"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerBackTitle: null,
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="bottomTabs"
        component={BottomTabNavigator}
        options={({navigation, route}) => ({
          headerTitle: getHeaderTitle(route),
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'flex-start',
          },
          headerRight: () => (
            <View style={{flexDirection: 'row'}}>
              <Ionicons
                name="wallet"
                size={24}
                color={Colors.white}
                style={{paddingHorizontal: RFValue(20)}}
                onPress={() => navigation.navigate('Wallet')}
              />
            </View>
          ),
        })}
      />
 
      <Stack.Screen
        name="services"
        component={ServicesScreen}
        options={{
          title: I18n.t('services'),
          headerStyle: {backgroundColor: Colors.primary},
          headerTintColor: Colors.white,
          headerBackTitle: null,
        }}
      />
        <Stack.Screen
        name="job"
        component={JobHistoryScreen}
        options={{
          title:'Job History',
          headerStyle: {backgroundColor: Colors.primary},
          headerTintColor: Colors.white,
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="notify"
        component={NotifyScreen}
        options={{title: I18n.t('alertScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="account"
        component={AccountDetailScreen}
        options={{title: I18n.t('accDetails'), headerBackTitle: null}}
      />
        <Stack.Screen
        name="complaintDetail"
        component={UserComplaintDetailScreen}
        options={{title: 'Complaint Detail', headerBackTitle: null}}
      />
      <Stack.Screen
        name="refer"
        component={ReferScreen}
        options={{title: null, headerBackTitle: null}}
      />
      <Stack.Screen
        name="trade"
        component={TradeScreen}
        options={() => ({
          title: null,
          headerBackTitle: null,
          headerRight: () => (
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: RFValue(18),
                marginHorizontal: RFValue(15),
              }}>
              {I18n.t('tradeLic')}
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="TXN"
        component={TXNScreen}
        options={() => ({
          title: null,
          headerBackTitle: null,
          headerRight: () => (
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: RFValue(18),
                marginHorizontal: RFValue(15),
              }}>
              {I18n.t('tranDetails')}
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="Bank"
        component={BankDetailScreen}
        options={() => ({
          title: null,
          headerBackTitle: null,
          headerRight: () => (
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: RFValue(18),
                marginHorizontal: RFValue(15),
              }}>
              {I18n.t('bankAcc')}
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="addService"
        component={AddServiceScreen}
        options={() => ({
          title: null,
          headerBackTitle: null,
          headerRight: () => (
            <Text
              style={{
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: RFValue(18),
                marginHorizontal: RFValue(15),
              }}>
              Add Service
            </Text>
          ),
        })}
      />
      <Stack.Screen
        name="help"
        component={HelpScreen}
        options={{title: I18n.t('helpScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="categories"
        component={CategoryScreen}
        options={{title: I18n.t('catScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="updatepassword"
        component={SecurityScreen}
        options={{
          title: I18n.t('updPass'),
          headerStyle: {backgroundColor: Colors.primary},
          headerTintColor: Colors.white,
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="profile_details"
        component={ProfileDetails}
        options={{
          title: I18n.t('profileScreenTitle'),
          headerStyle: {backgroundColor: Colors.primary},
          headerTintColor: Colors.white,
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="status"
        component={StatusScreen}
        options={{
          title: I18n.t('statusScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="BookingStatus"
        component={BookingStatusScreen}
        options={{
          title: I18n.t('bookingStatusScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="invoice"
        component={InvoiceScreen}
        options={{title: I18n.t('invoiceScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="HistoryStatus"
        component={HistoryStatusScreen}
        options={{title: I18n.t('statusScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="ServicePrice"
        component={ServicePriceScreen}
        options={{title: I18n.t('updService'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{title: I18n.t('walletScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="Recharge"
        component={RechargeScreen}
        options={{title: 'Recharge', headerBackTitle: null}}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{title: 'Payment', headerBackTitle: null}}
      />
      <Stack.Screen
        name="Transaction"
        component={TransactionScreen}
        options={{title: I18n.t('transScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="updateProfile"
        component={UpdateProfileScreen}
        options={{title: I18n.t('menuUpdateProfile'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="gallery"
        component={GalleryScreen}
        options={{title: I18n.t('menuGallery'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="Complaint"
        component={UserComplaintScreen}
        options={{title: I18n.t('regComplaint'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="feedBack"
        component={FeedbackFormScreen}
        options={{title: I18n.t('complaintFeedback'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="Calender"
        component={CalenderScreen}
        options={{title: I18n.t('calScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="myReview"
        component={MyReviewScreen}
        options={{title: I18n.t('menuReview'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="message"
        component={MessageScreen}
        options={messageScreenOptions}
      />
      <Stack.Screen
        name="withdrawal"
        component={WithdrawalScreen}
        options={{
          title: I18n.t('withdrawScreenTitle'),
          headerBackTitle: null,
        }}
      />
      <Stack.Screen
        name="Plans"
        component={AllPlanScreen}
        options={{title: I18n.t('plansScreenTitle'), headerBackTitle: null}}
      />
      <Stack.Screen
        name="PlansPayment"
        component={PlanPaymentScreen}
        options={{title: 'Payment', headerBackTitle: null}}
      />
        <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{headerTitle: 'Choose delivery Location'}}
        />
        <Stack.Screen
            name="changeLocation"
            component={ChangeLocationScreen}
            options={{headerTitle: 'Select Your Location'}}
        /> 
    </Stack.Navigator>
  );
};

export default RootStack;
