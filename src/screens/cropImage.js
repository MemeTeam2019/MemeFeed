import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  Platform,
} from 'react-native';

import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';
import ImageCrop from 'react-native-image-cropper';

export default class EditProfilePic extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      selectedIcon: false,
      icon: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      const uid = firebase.auth().currentUser.uid;
      // Get the profile icon
      firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            const { icon } = docSnapshot.data();
            this.setState({ icon });
          }
        })
        .catch((error) => {
          //console.log(error);
        });
      this.userListener = firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then((snapshot) => this.setState(snapshot.data()));
    }
  }

  //go back to profile with updated picture
  setPicture = async () => {
    this.props.navigation.push('Profile');
  };

  render() {
    return (
      <View>
        <ImageCrop
          ref={'cropper'}
          image={this.state.icon}
          cropHeight={this.state.height}
          cropWidth={this.state.width}
          zoom={this.state.zoom}
          maxZoom={80}
          minZoom={20}
          panToMove={true}
          pinchToZoom={true}
        />
        <Text onPress={this.capture()}>Capture()</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    elevation: 10,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingLeft: 3,
    paddingTop: 10, //50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    marginTop: '20%',
    marginBottom: '3%',
  },
  title: {
    fontSize: 28,
    fontFamily: 'AvenirNext-Regular',
    paddingHorizontal: '5%',
    marginBottom: '1%',
    textAlign: 'center',
    height: 70,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.4,
    color: 'black',
  },
  textButton: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    paddingHorizontal: '5%',
    marginBottom: '1%',
    marginTop: 15,
    textAlign: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    height: 70,
    color: 'black',
  },
  button: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    paddingHorizontal: '5%',
    marginBottom: '1%',
    textAlign: 'center',
    height: 20,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    //position: 'absolute', //Here is the trick
    //bottom: 0, //Here is the trick
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  nextBut: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '2%',
  },
  picture: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 36,
  },
});
