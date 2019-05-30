import React from 'react';
import {
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
import firebase from 'react-native-firebase';

export default class ConfirmScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    if (firebase.auth().currentUser) {
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(() => {
          //console.log('Email has been sent');
        })
        .catch((error) => {
          //console.log('Email not sent', error);
        });
    } else {
      Alert.alert(
        'Authentication Error',
        'Please try again or contact memefeedaye@gmail.com',
        [
          {
            text: 'OK',
            onPress: () => this.props.navigation.popToTop(),
          },
        ]
      );
    }
  }

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={require('../images/white.png')}
      >
        <Text style={styles.aboutText}>
          Confirmation email has been sent to{' '}
          {firebase.auth().currentUser
            ? firebase.auth().currentUser.email
            : ' '}
          . Check your inbox
        </Text>
        <View style={styles.nextBut}>
          <TouchableOpacity onPress={() => this.props.navigation.popToTop()}
                            style={styles.button}>
              <Text style={styles.button}> Ok </Text>
          </TouchableOpacity>
        </View>
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
    //color: '#9F02FF',
    fontSize: 18,
    paddingHorizontal: '5%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  nextBut: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '5%',
  },
  title: {
    fontSize: 35,
    fontFamily: 'AvenirNext-Regular',
    //color: '#9F02FF',
    paddingHorizontal: '5%',
    marginBottom: '0.5%',
    textAlign: 'center',
    height: 50,
    //backgroundColor: 'red',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.4,
  },
  aboutText: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    color: 'black',
    paddingHorizontal: '4%',
    marginBottom: '1%',
    paddingRight: 5,
    paddingTop: 150, //50
    paddingLeft: 5,
    //backgroundColor: 'blue',
    marginLeft: '3%',
    marginRight: '3%',
    //height: '50%'
  },
  button: {
    flex: 1,
    backgroundColor: 'transparent',
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
    paddingTop: 20,
    justifyContent: 'flex-end',
  }
});
