import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Divider ,FAB,Portal,Modal,TextInput,Button } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Colors from "../constant/Colors";
import * as userActions from "../store/actions/user";
import I18n from "../languages/I18n";
import AntDesign from "react-native-vector-icons/AntDesign";
import RFValue from "../../rfvalue";

const WalletScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const { partner } = useSelector((state) => state.user);

  const [visible, setVisible] = React.useState(false);
  const [amt, setAmt] = React.useState(0);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: RFValue(40),
    borderRadius: RFValue(20)
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.set_Profile());
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
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Pressable style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: RFValue(50), height: RFValue(50) }}>
            <Image
              source={require("../assets/wallet.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <Text style={styles.amt}>
            SMARTSEVA Cash
          </Text>
        </View>
        <Text style={styles.amt}>
          {I18n.t("walletAed")} {partner.partner_wallet}
        </Text>
      </Pressable>
      <Divider />
      <Pressable
        style={styles.container}
        onPress={() => navigation.navigate("Transaction")}
      >
        <Text style={styles.title}>{I18n.t("walletTran")}</Text>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color="black"
          style={{ marginTop: RFValue(5) }}
        />
      </Pressable>
      <Divider />
      <FAB
          style={styles.fab}
          label={"Recharge"}
          icon="plus"
          onPress={() => navigation.navigate("Recharge")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    padding: RFValue(10),
  },
  amt: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    padding: RFValue(15),
  },
  title: {
    fontSize: RFValue(15),
    paddingVertical: RFValue(8),
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: RFValue(15),
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor:"#f5b942"
  },
  newModal:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginVertical:RFValue(10)
  },
  btnStyles:{
    marginVertical:RFValue(20),
    width:"45%",
    borderRadius:RFValue(50),
    alignSelf:"center"
  },
  amtText:{
    fontWeight: "bold",
    fontSize:RFValue(15)
  }
});

export default WalletScreen;
