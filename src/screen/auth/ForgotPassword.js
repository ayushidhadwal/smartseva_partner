import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  StyleSheet,
  StatusBar,
  View,
  Image,
  Text,
  I18nManager,
} from "react-native";
import { TextInput, Title, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import Colors from "../../constant/Colors";
import * as authActions from "../../store/actions/auth";
import I18n from "../../languages/I18n";

const ForgotPassword = (props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const onVerifyhandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.forgotPassword({ email }));
      props.navigation.navigate("OTP");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [{ email }]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{ backgroundColor: Colors.white }}
      >
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={Colors.primary}
        />
        <View style={styles.imgContainer}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logoImg}
          />
        </View>
        <Title style={styles.forgot}>{I18n.t("reset")}</Title>
        <View style={styles.form}>
          <TextInput
            left={<TextInput.Icon name="email" color={Colors.primary} />}
            mode={I18nManager.isRTL ? "outlined" : "flat"}
            label={I18n.t("email")}
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={styles.info}>{I18n.t("resetMsg")}</Text>
          <Button
            mode="contained"
            style={styles.btn}
            labelStyle={{ paddingVertical: 2 }}
            contentStyle={{ height: 50 }}
            // onPress={() => props.navigation.navigate("reset")}
            onPress={onVerifyhandler}
            disabled={loading}
            loading={loading}
          >
            {I18n.t("verifyBtn")}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  imgContainer: {
    width: wp("100%"),
    height: hp("25%"),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoImg: {
    width: "90%",
    height: "100%",
    resizeMode: "contain",
  },
  btn: {
    height: 50,
    marginTop: 40,
    backgroundColor: Colors.primary,
  },
  forgot: {
    textAlign: "center",

    fontSize: 30,
    textTransform: "uppercase",
    paddingTop: 30,
  },
  form: {
    padding: 15,
  },
  info: {
    paddingVertical: 8,
    color: Colors.black,
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default ForgotPassword;
