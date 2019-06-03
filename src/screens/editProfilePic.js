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

  //open up the image picker, select image, and have it get updated in firebase
  chooseFile = () => {
    var options = {
      noData: true
    };

    ImagePicker.launchImageLibrary(options, async (response) => {
      console.log('Response = ', response);
      //if user selects an image, stored under response.uri
      if(response.uri){
        console.log(response.uri);
        this.setState({ icon: response.uri,
        });
        const path = this.state.icon
        //convert uri to url and store to firebase
        const docId = firebase.auth().currentUser.uid+"profile"
        const storRef = firebase.storage().ref('User_Icon').child(docId);
        const filePut = await storRef.putFile(path);
        //convert uri into url and store in firebase
        storRef.getDownloadURL().then( async (newurl) => {
          //update firebase with new icon
          firebase
            .firestore()
            .collection('Users')
            .doc(firebase.auth().currentUser.uid)
            .update({
              icon: newurl,
            });
            console.log("CONVERTING URL DONE");
        })
    }
      //errors for image picker
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

  //go back to profile with updated picture
  setPicture = async () => {
    this.props.navigation.push('Profile');
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
        <View style={styles.picture}>
          <Image
            source={{ uri: this.state.icon }}
            style={{ width: 200, height: 200, borderRadius: 200 / 2, justifyContent: 'center', alignItems: 'center' }}
          />
        </View>
        <View>
          <TouchableOpacity onPress={this.chooseFile.bind(this)}>
          <Text style={styles.textButton}> Change Profile Picture</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.setPicture.bind(this)}
                            style={styles.doneButton}>
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
    marginTop: 20
  },
  textButton: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    paddingHorizontal: '5%',
    marginBottom: '1%',
    marginTop: 25,
    textAlign: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    height: 70,
    color: 'black'
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
    //width: 85,
    //height: 85,
    //borderRadius: 85 / 2,
    justifyContent: 'center',
    alignItems: 'center',

  },
  doneButton: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 36,
  }
});
