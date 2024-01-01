import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Pressable,
  Image,
  ActivityIndicator,
  Modal,
  Text,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {FAB} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as userActions from '../../store/actions/user';
import {URL} from '../../constant/base_url';
import Colors from '../../constant/Colors';
import I18n from '../../languages/I18n';
import RFValue from '../../../rfvalue';

const GalleryScreen = props => {
  const {photos} = props.route.params;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [img, setImg] = useState();

  const dispatch = useDispatch();

  const {getGallery} = useSelector(state => state.user);

  const navigation = props.navigation;

  useEffect(() => {
    if (photos !== undefined) {
      addImages(photos);
      props.route.params.photos = undefined;
    }
  }, [photos]);

  const addImages = async img => {
    setUploading(true);
    setError(null);
    try {
      await dispatch(userActions.addImages(img));
      await dispatch(userActions.getGallery());
    } catch (e) {
      setError(e.message);
    }
    setUploading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.getGallery());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return () => unsubscribe;
  }, [navigation]);

  const _deleteImg = async imageId => {
    Alert.alert(I18n.t('alertTitle'), I18n.t('alertGalleryMsg'), [
      {
        text: I18n.t('cancelBtn'),
      },
      {
        text: I18n.t('okBtn'),
        onPress: async () => {
          setError(null);
          try {
            await dispatch(userActions.deleteImage(imageId));
            await dispatch(userActions.getGallery());
          } catch (e) {
            setError(e.message);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const result = getGallery.map(m => ({
    url: URL + m.image_path,
  }));

  if (loading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (uploading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={{
            uri: 'https://cdn.dribbble.com/users/3337757/screenshots/6825268/076_-loading_animated_dribbble_copy.gif',
          }}
          style={{width: RFValue(100), height: RFValue(100)}}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {getGallery.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: RFValue(17),
              color: Colors.primary,
              textAlign: 'center',
            }}>
            {`No Images Added Yet !!! \n Please add some using add button below.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={getGallery}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
          numColumns={3}
          renderItem={({item, index}) => {
            return (
              <View>
                <Pressable
                  style={styles.container}
                  onPress={() => setImg(index)}>
                  <Image
                    source={{
                      uri: URL + item.image_path,
                    }}
                    style={styles.img}
                  />
                </Pressable>
                <Modal
                  visible={img > -1}
                  transparent={true}
                  onRequestClose={() => setImg(undefined)}>
                  <ImageViewer
                    imageUrls={result}
                    enableSwipeDown={true}
                    onSwipeDown={() => setImg(undefined)}
                    index={img}
                  />
                </Modal>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color={Colors.primary}
                  style={styles.delete}
                  onPress={() => _deleteImg(item.id)}
                />
              </View>
            );
          }}
        />
      )}
      {/*<FAB*/}
      {/*  style={styles.fab}*/}
      {/*  icon="plus"*/}
      {/*  onPress={() => navigation.navigate("ImageBrowser", { name: "gallery" })}*/}
      {/*/>*/}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: RFValue(10),
  },
  container: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#ffff',
    marginBottom: RFValue(9),
    marginLeft: RFValue(12),
    padding: RFValue(8),
    width: RFValue(100),
    height: RFValue(100),
  },
  img: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
  },
  delete: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

export default GalleryScreen;
