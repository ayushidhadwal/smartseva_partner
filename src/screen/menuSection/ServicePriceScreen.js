import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { StyleSheet, Alert, Text, View, I18nManager } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "../../constant/Colors";
import * as requestAction from "../../store/actions/request";
import I18n from "../../languages/I18n";
import RFValue from "../../../rfvalue";

const ServicePriceScreen = ({ route, navigation }) => {
  const { id, status, service_price, service_desc } = route.params;

  const [price, setPrice] = useState(service_price);
  const [desc, setDesc] = useState(service_desc);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const onclickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(requestAction.updateServicePrice(id, price, desc));
      setLoading(false);
      Alert.alert("Alert", "Successfully Updated!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [id, price, desc]);

  const statusHandler = useCallback(async () => {
    setStatusLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.updateServiceStatus(id));
      setStatusLoading(false);
      Alert.alert("Alert", "Status Changed Successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      setError(e.message);
      setStatusLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (error) {
      Alert.alert("Alert", error.toString(), [
        { text: "OK", onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: RFValue(10),
          }}
        >
          <Text style={{ fontSize: RFValue(15), paddingTop: RFValue(6) }}>
            {I18n.t("changeStatus")}
          </Text>
          <Button
            mode={status === 1 ? "contained" : "outlined"}
            onPress={statusHandler}
            loading={statusLoading}
            disabled={statusLoading}
          >
            {status === 1 ? I18n.t("activeStatus") : I18n.t("inactiveStatus")}
          </Button>
        </View>
        <TextInput
          mode={I18nManager.isRTL ? "outlined" : "flat"}
          label={I18n.t("addPrice")}
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="number-pad"
        />
        <TextInput
          mode={I18nManager.isRTL ? "outlined" : "flat"}
          label={I18n.t("addDesc")}
          value={desc}
          onChangeText={setDesc}
          style={styles.input}
        />
        <Button
          mode="contained"
          contentStyle={{ height: 50 }}
          style={styles.btn}
          onPress={onclickHandler}
          loading={loading}
          disabled={loading}
        >
          {I18n.t("updBtn")}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: RFValue(12),
    backgroundColor: Colors.white,
  },
  input: {
    marginBottom: RFValue(20),
    backgroundColor: Colors.white,
  },
  btn: {
    width: "50%",
    alignSelf: "center",
    marginVertical: RFValue(20),
    borderRadius: RFValue(50),
  },
});

export default ServicePriceScreen;
