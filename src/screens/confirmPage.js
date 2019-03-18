import React from 'react';
import { Text, Button, StyleSheet, ImageBackground } from 'react-native';
import firebase from 'react-native-firebase';

export default class ConfirmScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        console.log('Email has been sent');
      })
      .catch(error => {
        console.log('Email not sent', error);
      });
  }

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={require('../images/bkgrnd.jpeg')}
      >
        <Text style={styles.text}>
          Confirmation email has been sent to{' '}
          {firebase.auth().currentUser.email}. Check your inbox
        </Text>
        <Button
          title="OK"
          color="#fff"
          onPress={() => this.props.navigation.popToTop()}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    paddingHorizontal: '5%',
  },
});
