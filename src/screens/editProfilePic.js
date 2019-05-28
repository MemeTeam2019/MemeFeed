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

  _onPressButton = async (newIcon) => {
    const oldIcon = this.state.selectedIcon;
    this.setState({
      selectedIcon: newIcon === oldIcon ? false : newIcon,
      icon: newIcon,
    });
    firebase
      .firestore()
      .collection('Users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        icon: this.iconImages[newIcon],
      });
  };

  _onNextButton = async () => {
    this.props.navigation.push('About');
  };

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
          <Image source={require('../images/userIcons/icon888.png')}
                 style={{ justifyContent: 'center', width: 180, height: 180, borderRadius: 180 / 2 }} />
        </View>
        <View>
          <TouchableOpacity>
          <Text style={styles.button}> Choose another profile picture </Text>
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
