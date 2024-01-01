import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { Button, Card, TextInput, Title } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

import * as userActions from "../../store/actions/user";
import Colors from "../../constant/Colors";
import I18n from "../../languages/I18n";
import RFValue from "../../../rfvalue";

const WithdrawalScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [amt, setAmt] = useState("");

  const dispatch = useDispatch();

  const { getWithdrawalList } = useSelector((state) => state.user);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.getWithdrawalRequest());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  const _requestHandler = useCallback(async () => {
    setRequestLoading(true);
    setError(null);
    try {
      await dispatch(userActions.sendRequest(amt));
      setModalVisible(false);
      alert("Request sent Successfully !!!");
    } catch (e) {
      setError(e.message.toString());
      setModalVisible(false);
    }
    setRequestLoading(false);
  }, [amt]);

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
      {getWithdrawalList.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: RFValue(17),
              color: Colors.primary,
              textAlign: "center",
            }}
          >
            {`No Withdrawal Request !!!`}
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={getWithdrawalList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <Card style={styles.cardContainer}>
                <Text style={styles.font}>
                  {I18n.t("amtReq")}: {I18n.t("statusAed")} {item.wr_amount}
                </Text>
                <Text
                  style={
                    item.wr_status === "PENDING"
                      ? [styles.status, { color: Colors.primary }]
                      : item.wr_status === "ACCEPTED"
                      ? [styles.status, { color: Colors.darkYellow }]
                      : item.wr_status === "REJECTED"
                      ? [styles.status, { color: "red" }]
                      : item.wr_status === "COMPLETED"
                      ? [styles.status, { color: "green" }]
                      : null
                  }
                >
                  {I18n.t("statusType")}: {item.wr_status}
                </Text>

                <Text style={styles.font}>
                  {I18n.t("reqAt")}:{" "}
                  {dayjs(item.created_at).format("DD MMM YYYY hh:mm a")}
                </Text>
              </Card>
            );
          }}
        />
      )}
      {/*<View style={{ backgroundColor: "#ffff" }}>*/}
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.rowStyle}>
                <Title style={{ color: Colors.primary }}>
                  {I18n.t("withdrawReq")}
                </Title>
                <AntDesign
                  name="closecircle"
                  size={24}
                  color={Colors.primary}
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
              <TextInput
                mode={"outlined"}
                keyboardType={"number-pad"}
                value={amt}
                onChangeText={(text) => setAmt(text)}
                label={I18n.t("reqLabel")}
              />
              <Button
                mode={"contained"}
                style={styles.btnStyles}
                loading={requestLoading}
                disabled={requestLoading}
                onPress={_requestHandler}
              >
                {I18n.t("request")}
              </Button>
            </View>
          </View>
        </Modal>
      </View>
      <Button
        mode={"contained"}
        icon="plus"
        onPress={() => setModalVisible(true)}
        style={styles.fab}
        contentStyle={{ height: 45 }}
      >
        {I18n.t("newReq")}
      </Button>
      {/*</View>*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: RFValue(10),
  },
  cardContainer: {
    marginVertical: RFValue(5),
    marginHorizontal: RFValue(5),
    padding: RFValue(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderRadius: RFValue(10),
  },
  font: {
    fontSize: RFValue(13),
  },
  status: {
    fontSize: RFValue(13),
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    width: "45%",
    borderRadius: RFValue(20),
  },
  /// modal css
  centeredView: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFValue(10),
  },
  btnStyles: {
    width: "50%",
    alignSelf: "center",
    borderRadius: RFValue(20),
    marginTop: RFValue(20),
  },
});
export default WithdrawalScreen;
