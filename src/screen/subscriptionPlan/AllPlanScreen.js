import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "react-native-paper";

import * as userActions from "../../store/actions/user";
import Colors from "../../constant/Colors";
import I18n from "../../languages/I18n";

const AllPlanScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const { myPlans } = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.getmyPlans());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  const onClickHandler = useCallback(async (planId) => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(userActions.getFreePlan(planId));
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Alert", error.toString(), [
        { text: "OK", onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={myPlans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card
            style={[styles.container, item.subscribed === 1 && styles.selected]}
          >
            <Text style={styles.planName}>{item.plan_name}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <View>
                <Text style={styles.amt}>
                  {item.amount !== 0
                    ? item.currency +
                      " " +
                      item.amount +
                      "  (" +
                      item.plan_term +
                      ")"
                    : I18n.t("free")}
                </Text>
                <Text style={styles.bookings}>
                  {item.booking + "  " + I18n.t("bookPerDay")}
                </Text>
              </View>
              <Button
                mode="contained"
                style={styles.btn}
                loading={item.free === 1 && isLoading}
                disabled={
                  (item.free === 1 && isLoading) || item.subscribed === 1
                }
                onPress={() => {
                  item.free === 1
                    ? onClickHandler(item.id)
                    : navigation.navigate("PlansPayment", {
                        planId: item.id,
                        amount: item.amount,
                      });
                }}
              >
                {item.subscribed === 0
                  ? I18n.t("subBtn")
                  : I18n.t("subscribedBtn")}
              </Button>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};
export default AllPlanScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderWidth: 2,
    borderColor: Colors.grey,
  },
  selected: {
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: "#dae6ed",
  },
  planName: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  amt: {
    fontSize: 13,
  },
  bookings: {
    textAlign: "center",
    fontSize: 13,
  },
  btn: { marginVertical:10 },
});
