import React, {useEffect, useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Button, Card, Divider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {Table, Row, Rows} from 'react-native-table-component';
import Colors from '../constant/Colors';
import * as requestAction from '../store/actions/request';
import {URL} from '../constant/base_url';
import Rating from '../components/Rating';

import I18n from '../languages/I18n';
import RFValue from '../../rfvalue';

const TextRow = ({heading, text, color}) => (
  <Text style={styles.headingStyles}>
    {heading}:{' '}
    <Text style={{fontWeight: 'normal', color: color ? color : 'black'}}>
      {text}
    </Text>
  </Text>
);

const HistoryStatusScreen = props => {
  const {booking_id} = props.route.params;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = props.navigation;
  const dispatch = useDispatch();

  const {getDetailsOfBooking} = useSelector(state => state.request);

  const tableHead = [I18n.t('serviceTable'), I18n.t('totalTable')];

  const tableData = getDetailsOfBooking.serviceDetails.map(m => [
    m.child_cat === null
      ? `${m.subcategory_name}`
      : `${m.subcategory_name} - ${m.child_cat}`,
    '₹  ' + m.st_service_price.toFixed(2),
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getBookingDetails(booking_id));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [booking_id, dispatch, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.headingStyles,
            {
              fontSize: RFValue(18),
              textAlign: 'center',
              marginBottom: RFValue(10),
            },
          ]}>
          {I18n.t('statusScreen')}
        </Text>
        <View style={styles.cardContainer1}>
          <TextRow heading={I18n.t('statusBookId')} text={booking_id} />
          <TextRow
            heading={I18n.t('statusBookDate')}
            text={dayjs(
              getDetailsOfBooking.booking_details.booking_date,
            ).format('DD MMM YYYY')}
          />
          <TextRow
            heading={I18n.t('statusBookTime')}
            text={dayjs(
              `${getDetailsOfBooking.booking_details.booking_date} ${getDetailsOfBooking.booking_details.booking_time}`,
            ).format('hh:mm a')}
          />
          <TextRow
            heading={I18n.t('statusType')}
            text={getDetailsOfBooking.booking_details.status}
          />
          <TextRow
            heading={I18n.t('statusPayment')}
            text={getDetailsOfBooking.booking_details.payment_status}
          />
          <TextRow
            heading={'Amount'}
            text={I18n.t('statusAed') + getDetailsOfBooking.totalAmount}
          />
          {getDetailsOfBooking.booking_details.booking_comment && (
            <TextRow
              heading={I18n.t('statusInst')}
              text={getDetailsOfBooking.booking_details.booking_comment}
            />
          )}
          {/*<TextRow*/}
          {/*  heading={I18n.t('statusAddress')}*/}
          {/*  text={*/}
          {/*    getDetailsOfBooking.booking_details.addr_address +*/}
          {/*    ', ' +*/}
          {/*    getDetailsOfBooking.booking_details.addr_city +*/}
          {/*    ', ' +*/}
          {/*    getDetailsOfBooking.booking_details.addr_state*/}
          {/*  }*/}
          {/*/>*/}
          {/*<TextRow*/}
          {/*  heading={I18n.t('statusCont')}*/}
          {/*  text={getDetailsOfBooking.booking_details.addr_phonenumber}*/}
          {/*/>*/}
          <Text style={{marginBottom: RFValue(5), fontWeight: 'bold'}}>
            {I18n.t('statusDetails')}:
          </Text>
          <Table
            borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}
            style={{marginBottom: RFValue(10)}}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            <Rows data={tableData} textStyle={styles.text} />
            <Row
              data={[`Convenience Fee`, `+ ₹${getDetailsOfBooking.gst_amount}`]}
              textStyle={styles.text}
            />
            <Row
              data={
                getDetailsOfBooking.additional_price > 0
                  ? [
                      getDetailsOfBooking.booking_details.job_completed_comment,
                      `+ ₹${getDetailsOfBooking.additional_price}`,
                    ]
                  : null
              }
              textStyle={styles.text}
            />
            <Row
              data={['Total Amount', `₹${getDetailsOfBooking.totalAmount}`]}
              style={[styles.head]}
              textStyle={[styles.text]}
            />
          </Table>
          <Button
            mode="contained"
            style={{marginBottom: RFValue(10)}}
            onPress={() =>
              props.navigation.navigate('invoice', {booking_id: booking_id})
            }>
            {I18n.t('invoiceBtn')}
          </Button>
          <TextRow
            text={getDetailsOfBooking.completeDate}
            heading={I18n.t('completionTime')}
          />
          {getDetailsOfBooking.providerReview.length !== 0 && (
            <>
              <Text style={styles.headingStyles}>
                {I18n.t('attachProvided')}:
              </Text>
              <View
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}>
                {getDetailsOfBooking.providerReview.map((m, i) => (
                  <Image
                    key={i}
                    source={{uri: URL + m.images}}
                    style={{width: 100, height: 100, margin: 5}}
                  />
                ))}
              </View>
            </>
          )}
          {getDetailsOfBooking.booking_details.confirm_reason && (
            <TextRow
              heading={I18n.t('serviceConf')}
              text={getDetailsOfBooking.booking_details.confirm_reason}
            />
          )}
          {getDetailsOfBooking.serviceConfirmation.length !== 0 && (
            <>
              <Text style={styles.headingStyles}>{I18n.t('custAttach')}:</Text>
              <View
                style={{
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                }}>
                {getDetailsOfBooking.serviceConfirmation.map((m, i) => (
                  <Image
                    key={i}
                    source={{uri: URL + m.sc_images}}
                    style={{width: 100, height: 100, margin: 5}}
                  />
                ))}
              </View>
            </>
          )}
          {/*  COMPLAINTS MUST BE ADDED HERE  */}
          {getDetailsOfBooking.complaints && (
            <View style={[styles.card]}>
              <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
                {I18n.t('complaintDetails')}
              </Text>
              <Divider style={styles.marginVertical} />
              <TextRow
                heading={I18n.t('complaintSubj')}
                text={getDetailsOfBooking.complaints.cr_subject}
              />
              <TextRow
                heading={I18n.t('complaintComment')}
                text={getDetailsOfBooking.complaints.cr_comment}
              />
              {getDetailsOfBooking.complaints.feedback && (
                <TextRow
                  heading={I18n.t('complaintFeedback')}
                  text={getDetailsOfBooking.complaints.feedback}
                />
              )}
            </View>
          )}
          {/*  REVIEW MUST BE ADDED HERE  */}
          {getDetailsOfBooking.userReviews.map((review, i) => (
            <View style={[styles.card]}>
              <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
                {I18n.t('review')}
              </Text>
              <Divider style={styles.marginVertical} />
              <Rating
                rating={parseInt(
                  (review.services + review.vofm + review.behaviour) / 3,
                )}
                service={review.services}
                moneyOfValue={review.vofm}
                behaviour={review.behaviour}
              />
              <Text style={{fontWeight: 'normal', color: 'black'}}>
                {/* {review.message} */}
                {I18n.t('done')}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  headingStyles: {
    marginBottom: RFValue(5),
    fontWeight: 'bold',
  },
  cardContainer1: {
    padding: RFValue(10),
    width: '100%',
    alignSelf: 'center',
    marginBottom: RFValue(10),
  },
  head: {
    backgroundColor: '#f1f8ff',
  },
  text: {margin: 6, fontSize: RFValue(11), textAlign: 'center'},
  bold: {
    fontWeight: 'bold',
  },
  card: {
    // paddingHorizontal: RFValue(12),
    backgroundColor: 'white',
  },
  marginVertical: {
    marginVertical: RFValue(5),
  },
});

export default HistoryStatusScreen;
