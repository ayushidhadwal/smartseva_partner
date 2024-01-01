import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, Text, View, Alert, ActivityIndicator } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "../../constant/Colors";
import * as requestAction from "../../store/actions/request";
import I18n from "../../languages/I18n";
import RFValue from "../../../rfvalue";

const TXNScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenloading, setScreenLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { tax } = useSelector((state) => state.request);

  useEffect(() => {
    setName(tax.trn_name);
    setNumber(tax.trn_number);
  }, [tax]);

  const onclickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.updateTax(name, number));
      setLoading(false);
      Alert.alert("Alert Title", "Updated Successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [name, number]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setScreenLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getTax());
      } catch (e) {
        setError(e.message);
      }
      setScreenLoading(false);
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

  if (screenloading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView>
        <View style={styles.nameContainer}>
          <Text style={styles.label}>{I18n.t("trnName")}</Text>
          <Text style={{ color: Colors.grey }}>{I18n.t("trnNameMsg")}</Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>{I18n.t("taxReg")}</Text>
          <TextInput
            mode="outlined"
            dense
            style={styles.input1}
            value={number}
            onChangeText={setNumber}
          />
          <Button
            mode="outlined"
            icon="check"
            loading={loading}
            disabled={loading}
            onPress={onclickHandler}
            style={{ alignSelf: "center", marginBottom: RFValue(15) }}
          >
            {I18n.t("saveBtn")}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
    justifyContent: "space-between",
  },
  nameContainer: {
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
    marginBottom: RFValue(10),
    backgroundColor: Colors.white,
  },
  nameContainer1: {
    padding: RFValue(20),
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: RFValue(15),
    fontWeight: "bold",
  },
  input1: {
    marginBottom: RFValue(15),
  },
  input2: {
    marginBottom: RFValue(20),
  },
});

export default TXNScreen;
