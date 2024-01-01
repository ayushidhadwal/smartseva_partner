import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Table, Row, Rows } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import Colors from "../constant/Colors";
import * as requestAction from "../store/actions/request";
import I18n from "../languages/I18n";
import RFValue from "../../rfvalue";

const TextRow = ({ heading, text, color }) => (
  <Text style={styles.headingStyles}>
    {heading}:{" "}
    <Text style={{ fontWeight: "normal", color: color ? color : "black" }}>
      {text}
    </Text>
  </Text>
);

const StatusScreen = (props) => {
  const { booking_id } = props.route.params;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = props.navigation;
  const dispatch = useDispatch();

  const { getDetailsOfBooking } = useSelector((state) => state.request);

  const tableHead = [
    I18n.t("serviceTable"),
    I18n.t("priceTable"),
    I18n.t("qtyTable"),
    I18n.t("totalTable"),
  ];
  const tableData = getDetailsOfBooking.serviceDetails.map((m) => [
    m.child_cat === null
      ? `${m.service_name}\n${m.subcategory_name}\n(${m.service_desc})`
      : `${m.service_name} - ${m.subcategory_name} - ${m.child_cat}\n(${m.service_desc})`,
    "₹  " + m.st_service_price,
    m.st_qty,
    "₹  " + (m.st_service_price * m.st_qty).toFixed(2),
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
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
  }, [navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert("Alert", error.toString(), [
        { text: "OK", onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
              textAlign: "center",
              marginBottom: RFValue(10),
            },
          ]}
        >
          {I18n.t("statusScreen")}
        </Text>
        <View style={styles.cardContainer1}>
          <TextRow heading={I18n.t("statusBookId")} text={booking_id} />
          <TextRow
            heading={I18n.t("statusBookDate")}
            text={dayjs(
              getDetailsOfBooking.booking_details.booking_date
            ).format("DD MMM YYYY")}
          />
          <TextRow
            heading={I18n.t("statusBookTime")}
            text={getDetailsOfBooking.booking_details.booking_time}
          />
          <TextRow
            heading={I18n.t("statusCustName")}
            text={getDetailsOfBooking.booking_details.user_name}
          />

          <TextRow
            heading={I18n.t("statusType")}
            text={getDetailsOfBooking.booking_details.status}
          />
          <TextRow
            heading={I18n.t("statusPayment")}
            text={getDetailsOfBooking.booking_details.payment_status}
          />
          <TextRow
            heading={I18n.t("statusFees")}
            text={
              "₹ " + getDetailsOfBooking.booking_details.final_service_price
            }
          />
          {getDetailsOfBooking.booking_details.booking_comment && (
            <TextRow
              heading="Instructions"
              text={getDetailsOfBooking.booking_details.booking_comment}
            />
          )}
          <TextRow
            heading={I18n.t("statusAddress")}
            text={
              getDetailsOfBooking.booking_details.addr_address +
              ", " +
              getDetailsOfBooking.booking_details.addr_city +
              ", " +
              getDetailsOfBooking.booking_details.addr_country
            }
          />
          <TextRow
            heading={I18n.t("statusCont")}
            text={getDetailsOfBooking.booking_details.addr_phonenumber}
          />
          <Text style={{ marginBottom: RFValue(5), fontWeight: "bold" }}>
            {I18n.t("statusDetails")}:
          </Text>
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              flexArr={[2, 1, 0.7, 1]}
              data={tableHead}
              style={styles.head}
              textStyle={styles.text}
            />
            <Rows
              flexArr={[2, 1, 0.7, 1]}
              data={tableData}
              textStyle={styles.text}
            />
          </Table>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
  headingStyles: {
    marginBottom: RFValue(5),
    fontWeight: "bold",
  },
  cardContainer1: {
    padding: RFValue(10),
    width: "100%",
    alignSelf: "center",
    marginBottom: RFValue(10),
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  text: { margin: 6, fontSize: RFValue(11) },
});

export default StatusScreen;
