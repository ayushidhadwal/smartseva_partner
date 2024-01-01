import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, StatusBar, Text, View, Pressable,Alert,Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as userActions from '../store/actions/user';
import Geolocation from 'react-native-geolocation-service';
import {Button} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useReverseGeocoding} from '../hooks/useReverseGeocoding';

const MapScreen = ({navigation, route}) => {
  const {latitude, longitude} = route.params;

  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLat(Number(latitude));
      setLong(Number(longitude));
    });

    return unsubscribe;
  }, [navigation, latitude, longitude]);

  var markers = [
    {
      latitude: lat,
      longitude: long,
    },
  ];

  const getLocation = () => {
    Geolocation.getCurrentPosition(
        position => {
          console.log('position', position);
          const {coords} = position;
          setLat(coords.latitude);
          setLong(coords.longitude);
          alert('Update current location');
        },
        error => {
          Alert.alert(
              'Important!',
              error.message + ' Please grant location permission in order to use.',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log(''),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => Linking.openSettings()},
              ],
          );
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  function CustomMarker() {
    return (
      <View style={styles.marker}>
        <Text style={styles.color}>Tokyo</Text>
      </View>
    );
  }

  const geoAddress = useReverseGeocoding(lat, long);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#f5b942'} />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            annotations={markers}
            region={{
              latitude: lat,
              longitude: long,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            <Marker coordinate={{latitude: lat, longitude: long}} />
          </MapView>
        </View>
        <Pressable style={styles.currentLoc} onPress={getLocation}>
          <MaterialIcons name="my-location" size={20} color="white" />
          <Text style={styles.locStyle}>Use Current Location</Text>
        </Pressable>
        <View>
          <View style={styles.blockView}>
            <View style={styles.iconText}>
              <View style={{marginTop: 3}}>
                <MaterialIcons name="location-pin" size={20} color="black" />
              </View>
              <Text style={[styles.location, styles.blockStyle]}>Address</Text>
            </View>
            <Text
              style={[styles.location, styles.change]}
              onPress={() => navigation.navigate('changeLocation')}>
              Change
            </Text>
          </View>
          <Text style={styles.dwarka}>{geoAddress[0]}</Text>
        </View>
        <Pressable
          style={styles.btn}
          onPress={() =>
            navigation.navigate('updateProfile', {code: 'map', lat, long})
          }>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            Confirm Location
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    height: 450,
    width: 400,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  location: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  btn: {
    width: '95%',
    height: 35,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#f5b942',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  marker: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'red',
    borderColor: 'green',
    borderRadius: 5,
    elevation: 10,
  },
  text: {
    color: 'red',
  },
  currentLoc: {
    flexDirection: 'row',
    borderWidth: 2,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'space-evenly',
    padding: 5,
    position: 'absolute',
    bottom: 150,
    borderColor: '#f5b942',
    backgroundColor: '#f5b942',
  },
  locStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  blockView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconText: {
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 18,
  },
  blockStyle: {
    marginLeft: 5,
    color: 'black',
  },
  change: {
    color: '#f5b942',
    marginTop: 18,
    marginRight: 20,
  },
  dwarka: {
    marginLeft: 30,
    color: 'black',
  },
});
export default MapScreen;
