import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import firebase from 'react-native-firebase';

export default class VerifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email,
    };
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        this.props.navigation.navigate('Main');
      }
    });
    firebase.auth().currentUser.sendEmailVerification();
  }

  render() {
    return (
      <View>
        <Text>Check your email, {}, for a verification link</Text>
      </View>
    );
  }
}
