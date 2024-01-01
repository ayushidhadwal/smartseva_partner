import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Card} from 'react-native-paper';
import Colors from '../../constant/Colors';
import * as userActions from '../../store/actions/user';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';

const TransactionScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const {transaction} = useSelector(state => state.user);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(userActions.set_Transactions());
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      {loading ? (
        <ActivityIndicator size="large" style={styles.indicator} />
      ) : transaction.length === 0 ? (
        <Text style={styles.text}>No Transactions</Text>
      ) : (
        <FlatList
          data={transaction}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => (
            <Card
              style={[
                styles.cardContainer,
                index === 0 && {marginTop: RFValue(10)},
              ]}>
              <View style={styles.rowstyle}>
                <Text style={styles.amt}>
                  {I18n.t('tranAmt')}: ₹{item.wt_amount}
                </Text>
                {item.wt_type === 'DEBIT' ? (
                  // <Text style={styles.debit}>{item.wt_type}</Text>
                  <Text style={styles.debit}>{I18n.t('transDebit')}</Text>
                ) : (
                  // <Text style={styles.credit}>{item.wt_type}</Text>
                  <Text style={styles.credit}>{I18n.t('transCredit')}</Text>
                )}
              </View>
              <View>
                <Text style={styles.time}>
                  {I18n.t('tranTime')}: {item.created_at}
                </Text>
                <Text style={styles.details}>
                  {I18n.t('tranDetails')}: {item.wt_details}
                </Text>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
    textAlign: 'center',
    marginVertical: RFValue(250),
  },
  cardContainer: {
    marginBottom: RFValue(10),
    padding: RFValue(10),
    marginHorizontal: RFValue(10),
  },
  rowstyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amt: {
    fontSize: RFValue(15),
    paddingVertical: RFValue(8),
    fontWeight: 'bold',
  },
  debit: {
    backgroundColor: 'red',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(8),
    color: Colors.white,
    fontWeight: 'bold',
    borderRadius: RFValue(50),
  },
  credit: {
    backgroundColor: 'green',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    color: Colors.white,
    fontWeight: 'bold',
    borderRadius: RFValue(50),
  },
  time: {
    fontSize: RFValue(15),
    paddingTop: RFValue(3),
  },
  details: {
    fontSize: RFValue(15),
  },
});

export default TransactionScreen;
