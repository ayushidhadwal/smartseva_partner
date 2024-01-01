import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  Linking,
  Platform,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import {Button, Card, Divider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Colors from '../../constant/Colors';
import * as authActions from '../../store/actions/auth';
import {androidPackageName, androidPackageNameClient} from '../../constant/common';
import I18n from '../../languages/I18n';
import {URL} from '../../constant/base_url';
import RFValue from '../../../rfvalue';

const MenuScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const [error, setError] = useState(null);

  const logoutHandler = async () => {
    setError(null);
    try {
      await dispatch(authActions.logout());
    } catch (e) {
      setError(e.message);
    }
  };

  const _onShare = useCallback(async () => {
    try {
      await Share.share({
        message: `https://play.google.com/store/apps/details?id=${androidPackageName}`,
      });
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{I18n.t('jobs')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('job')}>
            <MaterialIcons
              name="work-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>Job History</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('Wallet')}>
            <MaterialIcons
              name="account-balance-wallet"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuBal')}</Text>
          </Pressable>
          {/*<Divider />*/}
          {/*<Pressable*/}
          {/*  style={styles.row1}*/}
          {/*  onPress={() => navigation.navigate("withdrawal")}*/}
          {/*>*/}
          {/*  <MaterialCommunityIcons*/}
          {/*    name="bank-transfer-out"*/}
          {/*    size={27}*/}
          {/*    color={Colors.primary}*/}
          {/*    style={styles.icon}*/}
          {/*  />*/}
          {/*  <Text style={styles.rowTitle}>{I18n.t("menuWithdraw")}</Text>*/}
          {/*</Pressable>*/}
        </Card>
        <Text style={styles.heading}>{I18n.t('acc')}</Text>
        <Card style={styles.cardContainer}>
          {/*<Pressable*/}
          {/*  style={styles.row1}*/}
          {/*  onPress={() => navigation.navigate("Plans")}*/}
          {/*>*/}
          {/*  <Ionicons*/}
          {/*    name="bookmarks"*/}
          {/*    size={22}*/}
          {/*    color={Colors.primary}*/}
          {/*    style={styles.icon}*/}
          {/*  />*/}
          {/*  <Text style={styles.rowTitle}>{I18n.t("menuPrem")}</Text>*/}
          {/*</Pressable>*/}
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('profile_details')}>
            <Ionicons
              name="person"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuProfile')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() =>
              navigation.navigate('updateProfile', {code: 'data'})
            }>
            <FontAwesome5
              name="user-edit"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuUpdateProfile')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('categories')}>
            <Ionicons
              name="list-sharp"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuService')}</Text>
          </Pressable>
          <Divider />
          {/*<Pressable*/}
          {/*  style={styles.row1}*/}
          {/*  onPress={() => navigation.navigate("services")}*/}
          {/*>*/}
          {/*  <MaterialIcons*/}
          {/*    name="add-task"*/}
          {/*    size={22}*/}
          {/*    color={Colors.primary}*/}
          {/*    style={styles.icon}*/}
          {/*  />*/}
          {/*  <Text style={styles.rowTitle}>{I18n.t("menuEditService")}</Text>*/}
          {/*</Pressable>*/}
          {/*<Divider />*/}
          {/*<Pressable*/}
          {/*  style={styles.row1}*/}
          {/*  onPress={() => navigation.navigate('Calender')}>*/}
          {/*  <Ionicons*/}
          {/*    name="md-calendar-outline"*/}
          {/*    size={22}*/}
          {/*    color={Colors.primary}*/}
          {/*    style={styles.icon}*/}
          {/*  />*/}
          {/*  <Text style={styles.rowTitle}>{I18n.t('menuCal')}</Text>*/}
          {/*</Pressable>*/}
          <Divider />
          {/*<Pressable*/}
          {/*  style={styles.row1}*/}
          {/*  onPress={() =>*/}
          {/*    navigation.navigate("gallery", {*/}
          {/*      name: "gallery",*/}
          {/*    })*/}
          {/*  }*/}
          {/*>*/}
          {/*  <Ionicons*/}
          {/*    name="images"*/}
          {/*    size={22}*/}
          {/*    color={Colors.primary}*/}
          {/*    style={styles.icon}*/}
          {/*  />*/}
          {/*  <Text style={styles.rowTitle}>{I18n.t("menuGallery")}</Text>*/}
          {/*</Pressable>*/}
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('myReview')}>
            <MaterialIcons
              name="rate-review"
              size={24}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuReview')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('Complaint')}>
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuComplaint')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('updatepassword')}>
            <Ionicons
              name="lock-closed"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuSecurity')}</Text>
          </Pressable>
          {/*<Divider />*/}
          {/*<Pressable style={styles.row1}>*/}
          {/*  <Ionicons*/}
          {/*    name="language"*/}
          {/*    size={22}*/}
          {/*    color={Colors.primary}*/}
          {/*    style={styles.icon}*/}
          {/*  />*/}
          {/*  <Text style={styles.rowTitle}>{I18n.t('menuLang')}</Text>*/}
          {/*</Pressable>*/}
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => navigation.navigate('account')}>
            <MaterialCommunityIcons
              name="bank"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuBank')}</Text>
          </Pressable>
        </Card>
        {/*<Text style={styles.heading}>{I18n.t('other')}</Text>*/}
        {/*<Card style={styles.cardContainer}>*/}
        {/*  <Pressable*/}
        {/*    style={styles.row1}*/}
        {/*    // onPress={_onShare}*/}
        {/*  >*/}
        {/*    <FontAwesome5*/}
        {/*      name="user-plus"*/}
        {/*      size={22}*/}
        {/*      color={Colors.primary}*/}
        {/*      style={styles.icon}*/}
        {/*    />*/}
        {/*    <Text style={styles.rowTitle}>{I18n.t('menuRefer')}</Text>*/}
        {/*  </Pressable>*/}
        {/*  <Divider />*/}
        {/*<Pressable style={styles.row1}>*/}
        {/*  <FontAwesome5*/}
        {/*    name="users"*/}
        {/*    size={22}*/}
        {/*    color={Colors.primary}*/}
        {/*    style={styles.icon}*/}
        {/*  />*/}
        {/*  <Text style={styles.rowTitle}>{I18n.t("menuFind")}</Text>*/}
        {/*</Pressable>*/}
        {/*</Card>*/}
        <Text style={styles.heading}>{I18n.t('support')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable
            style={styles.row1}
            onPress={() => Linking.openURL(`${URL}contact-us`)}>
            <MaterialCommunityIcons
              name="message-text-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuCont')}</Text>
          </Pressable>
        </Card>
        <Text style={styles.heading}>{I18n.t('app')}</Text>
        <Card style={styles.cardContainer}>
          <Pressable
            style={styles.row1}
            onPress={() => Linking.openURL(`${URL}terms-and-conditions`)}>
            <MaterialIcons
              name="list-alt"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuTerms')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() => Linking.openURL(`${URL}privacy-and-cookies-policy`)}>
            <Ionicons
              name="eye"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>{I18n.t('menuPrivacy')}</Text>
          </Pressable>
          <Divider />
          <Pressable
            style={styles.row1}
            onPress={() =>
              Linking.openURL(
                Platform.OS === 'ios'
                  ? `https://play.google.com/store/apps/details?id=${androidPackageNameClient}`
                  : `https://play.google.com/store/apps/details?id=${androidPackageNameClient}`,
              )
            }>
            <Ionicons
              name="download-outline"
              size={22}
              color={Colors.primary}
              style={styles.icon}
            />
            <Text style={styles.rowTitle}>Download SMARTSEVA Customer App</Text>
          </Pressable>
        </Card>
        <Button mode="outlined" style={styles.btn} onPress={logoutHandler}>
          {I18n.t('logoutBtn')}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    color: Colors.grey,
    fontSize: RFValue(16),
    padding: RFValue(8),
    fontWeight: 'bold',
  },
  iosHeading: {
    marginTop: RFValue(-18),
    fontWeight: 'bold',
  },
  row1: {
    flexDirection: 'row',
    marginHorizontal: RFValue(10),
  },
  cardContainer: {
    padding: RFValue(5),
    borderRadius: RFValue(6),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 3,
    width: '95%',
    alignSelf: 'center',
  },
  rowTitle: {
    fontSize: RFValue(15),
    paddingLeft: RFValue(10),
    paddingVertical: RFValue(10),
  },
  icon: {
    paddingTop: RFValue(8),
  },
  btn: {
    marginTop: RFValue(25),
    marginBottom: RFValue(25),
    width: '60%',
    alignSelf: 'center',
  },
  heading1: {
    fontWeight: 'bold',
  },
});

export default MenuScreen;
