import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ImageBackground,
} from "react-native";
import firebase from "react-native-firebase";

export default class VerifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email,
    }
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        this.props.navigation.navigate("Main");
      }
    });
    firebase.auth().currentUser.sendEmailVerification();
  }

  render() {
    return (
    <ImageBackground
        source={require('../images/bkgrnd.jpeg')}
        style={styles.background}>
      <View>
        <Text style={styles.aboutText}>Check your email, {}, for a verification link</Text>
      </View>
    </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
    aboutText: {
      fontSize: 16,
      fontFamily: 'AvenirNext-Regular',
      color: 'white',
      paddingHorizontal: '3%',
      marginBottom: '3%',
      textAlign: 'center',
      paddingRight: 5,
      paddingTop: 5,//50
      paddingLeft: 5,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: .5 },
      shadowOpacity: 0.5,
      shadowRadius: .4,
    },
});
