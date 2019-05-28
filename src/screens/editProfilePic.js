import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  Platform
} from 'react-native';

import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';

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

  chooseFile = () => {
    var options = {
      noData: true
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if(response.uri){
        this.setState({ icon: response.uri,
                        //filename: response.filename,
                        //isChosen: true,

        });
        firebase
          .firestore()
          .collection('Users')
          .doc(firebase.auth().currentUser.uid)
          .update({
            icon: response.uri,
          });
      }

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
        });
      }
    });

}


 setPicture = () => {


 }







  render() {
    return (
      <ImageBackground
        source={require('../images/white.png')}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}> Edit Profile Picture </Text>
        </View>
        <View>
          <Image
            source={{ uri: this.state.icon }}
            style={{ width: 85, height: 85, borderRadius: 85 / 2 }}
          />
        </View>
        <View>
          <TouchableOpacity onPress={this.chooseFile.bind(this)}>
          <Text style={styles.button}> Change Profile Picture</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.setPicture.bind(this)}>
          <Text style={styles.button}> Done </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
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
    fontSize: 35,
    fontFamily: 'AvenirNext-Regular',
    paddingHorizontal: '5%',
    marginBottom: '1%',
    textAlign: 'center',
    height: 70,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.4,
    color: 'black'
  },
  button: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    paddingHorizontal: '5%',
    marginBottom: '1%',
    textAlign: 'center',
    height: 20,
    color: 'black'
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
});
