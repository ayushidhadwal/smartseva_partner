import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Divider,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Colors from '../constant/Colors';
import * as userActions from '../store/actions/user';
import I18n from '../languages/I18n';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RazorpayCheckout from 'react-native-razorpay';
import {PAYMENT_KEY} from '../constant/common';
import RFValue from '../../rfvalue';

const RechargeScreen = ({navigation}) => {
  const {orderId} = useSelector(state => state.user);
  const [btnLoading, setBtnLoading] = useState(false);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const [amt, setAmt] = React.useState('');

  const onSubmitHandler = async () => {
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(userActions.Recharge(amt));
      navigation.navigate('Payment', {amt: amt});
    } catch (e) {
      setError(e.message);
    }
    setBtnLoading(false);
  };

  const _onlinePaymentHandler = async () => {
    try {
      const options = {
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: 'INR',
        key: PAYMENT_KEY, // Your api key
        amount: '5000',
        name: 'foo',
        order_id: orderId,
        prefill: {
          email: 'void@razorpay.com',
          contact: '9191919191',
          name: 'Razorpay Software',
        },
        theme: {color: '#F37254'},
      };
      RazorpayCheckout.open(options)
        .then(data => {
          _submitOnlinePayment(
            data.razorpay_order_id,
            data.razorpay_payment_id,
            data.razorpay_signature,
          );
          Alert.alert('Alert', 'Order Placed Successfully', [
            {text: 'OK', onPress: () => navigation.pop(4)},
          ]);
        })
        .catch(error => {
          // handle failure
          alert(`Error: ${error.code} | ${error.description}`);
        });
    } catch (e) {
      setError(e.message);
      setOnlineLoading(false);
    }
  };

  const _submitOnlinePayment = async (order, paymentId, sign) => {
    setOnlineLoading(true);
    setError(null);

    try {
      await dispatch(userActions.onlineRecharge(amt, order, paymentId, sign));
      setOnlineLoading(false);
      // alert('Payment Successful');
      // navigation.navigate('wallet');
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/addMoney.png')}
        style={{
          alignSelf: 'center',
          width: RFValue(400),
          height: RFValue(250),
          resizeMode: 'contain',
        }}
      />
      <Text style={styles.amtText}>ADD AMOUNT</Text>
      <TextInput
        label={'Amount (in Rs.)'}
        style={styles.input}
        value={amt}
        onChangeText={setAmt}
        keyboardType={'number-pad'}
      />
      <Text style={{color: 'red', fontStyle: 'italic'}}>
        ** Note: minimum amount is Rs. 1000
      </Text>
      <Button
        mode={'contained'}
        labelStyle={{color: 'white'}}
        uppercase={false}
        loading={btnLoading}
        disabled={btnLoading}
        onPress={onSubmitHandler}
        style={styles.btnStyles}>
        Submit
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(20),
  },
  btnStyles: {
    marginVertical: RFValue(40),
    width: '45%',
    borderRadius: RFValue(50),
    alignSelf: 'center',
  },
  amtText: {
    fontWeight: 'bold',
    fontSize: RFValue(18),
    marginBottom: RFValue(30),
    textAlign: 'center',
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default RechargeScreen;
