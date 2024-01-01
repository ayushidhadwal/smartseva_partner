import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, Card } from "react-native-paper";
import Colors from "../../constant/Colors";
import * as requestAction from "../../store/actions/request";
import I18n from "../../languages/I18n";
import RFValue from "../../../rfvalue";

const ServicesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { serviceList } = useSelector((state) => state.request);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(requestAction.getServiceList());
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {serviceList.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: RFValue(20),
              fontWeight: "bold",
            }}
          >
            No Services Add Yet !!!
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={serviceList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            return (
              <Card
                style={[
                  styles.content,
                  index === 0 && { marginTop: RFValue(10) },
                ]}
                onPress={() =>
                  navigation.navigate("ServicePrice", {
                    id: item.id,
                    status: item.status,
                    service_price: item.service_price,
                    service_desc: item.service_desc,
                  })
                }
              >
                <Text style={styles.Service}>{item.servicename}</Text>
                <Text style={styles.text1}>
                  {I18n.t("task")}: {item.sub_servicename}
                </Text>
                <Text style={styles.charge}>
                  {I18n.t("charges")} {item.service_price}
                </Text>
                <Text style={styles.desc}>
                  {I18n.t("description")}: {item.service_desc}
                </Text>
                {item.status === 1 ? (
                  <Text style={styles.text4}>{I18n.t("statusActive")}</Text>
                ) : (
                  <Text style={styles.text5}>{I18n.t("statusInactive")}</Text>
                )}
              </Card>
            );
          }}
        />
      )}
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{ flexDirection: "row-reverse", height: 50 }}
        icon="plus-circle"
        onPress={() => navigation.navigate("addService")}
      >
        {I18n.t("addServiceBtn")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  heading: {
    fontWeight: "bold",
  },
  subHeading: {
    textAlign: "center",
    fontSize: RFValue(16),
    paddingTop: RFValue(250),
  },
  btn: {
    width: "45%",
    borderRadius: RFValue(20),
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  content: {
    marginBottom: RFValue(10),
    marginHorizontal: RFValue(10),
    padding: RFValue(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text1: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: "#000",
  },
  Service: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: "#000",
  },
  charge: {
    fontSize: RFValue(13),
    color: "#000",
  },
  desc: {
    fontSize: RFValue(13),
    color: "grey",
  },
  text2: {
    fontSize: RFValue(13),
    color: "#808080",
  },
  text4: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: Colors.primary,
  },
  text3: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: Colors.primary,
  },
  text5: {
    fontSize: RFValue(13),
    fontWeight: "bold",
    color: "#808080",
  },
});

export default ServicesScreen;
