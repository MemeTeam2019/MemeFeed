import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet
} from "react-native";
import firebase from "react-native-firebase";

export default class ConfirmScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        console.log("Email has been sent");
      })
      .catch(error => {
        console.log("Email not sent", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Confirmation email has been sent to {firebase.auth().currentUser.email}. Check your inbox
        </Text>
        <Button
          title="Ok"
          onPress={() => this.props.navigation.popToTop()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

