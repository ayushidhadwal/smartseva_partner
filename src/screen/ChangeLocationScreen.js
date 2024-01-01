import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, StatusBar, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Button} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {GOOGLE_MAP_KEY} from '../constant/googleMapKey';

const ChangeLocationScreen = ({navigation, route}) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#f5b942'} />
      {/*<KeyboardAwareScrollView*/}
      {/*    showsVerticalScrollIndicator={false}*/}
      {/*    keyboardShouldPersistTaps="handled"*/}
      {/*    bounces={false}*/}
      {/*>*/}
      <View style={{flex: 1}}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            navigation.navigate('Map', {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              adresss: details.formatted_address,
            });
          }}
          getDefaultValue={() => ''}
          query={{
            key: `${GOOGLE_MAP_KEY}`,
            language: 'en', // language of the results
          }}
          styles={{
            textInputContainer: {
              width: '100%',
            },
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          // nearbyPlacesAPI='GoogleMapsPlacesSearch' // Which API to use: GoogleReverseGeocoding or GoogleMapsPlacesSearch
          // GoogleReverseGeocodingQuery={{
          //     // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          // }}
          // GoogleMapsPlacesSearchQuery={{
          //     // available options for GoogleMapsPlacesSearch API : https://developers.google.com/places/web-service/search
          //     rankby: 'distance',
          //     type: 'cafe'
          // }}
          //
          // GoogleMapsPlacesDetailsQuery={{
          //     // available options for GoogleMapsPlacesDetails API : https://developers.google.com/places/web-service/details
          //     fields: 'formatted_address',
          // }}
          //
          // filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
          // renderLeftButton={()  => <Image source={require('path/custom/left-icon')} />}
          // renderRightButton={() => <Text>Custom text after the input</Text>}
        />
      </View>

      {/*</KeyboardAwareScrollView>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: 'green',
  },
  container: {
    // flex:1,
    height: 450,
    width: 400,
    // justifyContent: 'flex-end',
    alignItems: 'center',
    // marginTop:10
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  location: {
    //marginVertical:10,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  btn: {
    width: '95%',
    height: 50,
    alignSelf: 'center',
    marginTop: 20,
  },
});
export default ChangeLocationScreen;
