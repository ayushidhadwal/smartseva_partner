import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
// import * as ImageManipulator from 'expo-image-manipulator';
// import {ImageBrowser} from 'expo-image-picker-multiple';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';
export default class ImageBrowserScreen extends Component {
  _getHeaderLoader = () => <ActivityIndicator size="small" color={'#0580FF'} />;

  imagesCallback = callback => {
    const {navigation} = this.props;
    this.props.navigation.setOptions({
      headerRight: () => this._getHeaderLoader(),
    });

    callback
      .then(async photos => {
        const cPhotos = [];
        for (let photo of photos) {
          const pPhoto = await this._processImageAsync(photo.uri);
          cPhotos.push({
            uri: pPhoto.uri,
            name: photo.filename,
            type: 'image/jpg',
          });
        }

        {
          this.props.route.params.name === 'gallery'
            ? navigation.navigate('gallery', {photos: cPhotos})
            : navigation.navigate('BookingStatus', {photos: cPhotos});
        }
      })
      .catch(e => console.log(e));
  };

  // async _processImageAsync(uri) {
  //   const file = await ImageManipulator.manipulateAsync(
  //     uri,
  //     [{resize: {width: 1000}}],
  //     {compress: 0.8, format: ImageManipulator.SaveFormat.JPEG},
  //   );
  //   return file;
  // }

  _renderDoneButton = (count, onSubmit) => {
    if (!count) return null;
    return (
      <TouchableOpacity
        title={'Upload'}
        onPress={onSubmit}
        style={{marginRight: RFValue(10)}}>
        <Text
          onPress={onSubmit}
          style={{color: '#ffff', fontWeight: 'bold', fontSize: RFValue(13)}}>
          {I18n.t('updBtn')}
        </Text>
      </TouchableOpacity>
    );
  };

  updateHandler = async (count, onSubmit) => {
    this.props.navigation.setOptions({
      title: `Selected ${count} files`,
      headerRight: () => this._renderDoneButton(count, onSubmit),
    });
  };

  renderSelectedComponent = number => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );

  render() {
    const emptyStayComponent = (
      <Text style={styles.emptyStay}>
        No images have been selected. Please go back and try again.
      </Text>
    );

    return (
      <View style={[styles.flex, styles.container]}>
        {/*<ImageBrowser*/}
        {/*  max={10}*/}
        {/*  onChange={this.updateHandler}*/}
        {/*  callback={this.imagesCallback}*/}
        {/*  renderSelectedComponent={this.renderSelectedComponent}*/}
        {/*  emptyStayComponent={emptyStayComponent}*/}
        {/*/>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'relative',
  },
  emptyStay: {
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF',
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff',
  },
});
