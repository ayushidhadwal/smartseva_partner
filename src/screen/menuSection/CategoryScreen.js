import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import * as requestAction from "../../store/actions/request";
import Colors from "../../constant/Colors";
import I18n from "../../languages/I18n";
import { URL } from "../../constant/base_url";

const CategoryScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);
  const [number, setNumber] = useState([]);

  const dispatch = useDispatch();
  const { services } = useSelector((state) => state.request);
  const { selectService } = useSelector((state) => state.request);

  useEffect(() => {
    const ab = selectService.map((n) => n.service_id.toString());
    setNumber(ab);
  }, [selectService]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getServices());
        await dispatch(requestAction.get_selected_service());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  const _onServiceSelectHandler = (id) => {
    setNumber((preState) => {
      const nums = [...preState];
      const i = nums.findIndex((n) => n === id);
      if (i >= 0) {
        nums.splice(i, 1);
      } else {
        nums.push(id);
      }
      return nums;
    });
  };

  const submitHandler = async () => {
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(requestAction.selectServices(number));
      Alert.alert("Alert", "Updated Successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      setError(e.message);
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Alert", error.toString(), [
        { text: "OK", onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.screen}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <FlatList
          data={services}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          ListFooterComponent={() => (
            <Button
              mode="contained"
              style={styles.btn}
              loading={btnLoading}
              disabled={btnLoading}
              onPress={submitHandler}
            >
              {I18n.t("saveChange")}
            </Button>
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => _onServiceSelectHandler(item.id.toString())}
              style={[
                styles.container,
                number.find((n) => {
                  return n === item.id.toString();
                })
                  ? styles.onfocusbutton
                  : null,
              ]}
            >
              <Image
                source={{
                  uri: `${URL}public/images/services/${item.service_icon}`,
                }}
                style={styles.img}
              />
              <Text style={styles.name}>{item.service_name}</Text>
              <View style={styles.check} />
            </Pressable>
          )}
          numColumns={3}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  btn: {
    width: "50%",
    alignSelf: "center",
    marginVertical: 15,
  },
  list: {
    marginVertical: 20,
  },
  container: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "#ffff",
    marginBottom: 5,
    marginLeft: 9,
    padding: 8,
    width: wp("30%"),
    height: hp("17%"),
  },
  onfocusbutton: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "#dfe9f7",
    marginBottom: 5,
    marginLeft: 9,
    padding: 8,
    width: wp("30%"),
    height: hp("17%"),
  },
  img: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  name: {
    color: Colors.black,
    textAlign: "center",
    marginTop: 5,
  },
  check: {
    position: "absolute",
    alignSelf: "center",
    bottom: 0,
  },
});

export default CategoryScreen;
