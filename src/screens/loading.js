import React from "react";
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet
} from "react-native";
import firebase from "react-native-firebase";

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((User) => {
      console.log(User);
      AsyncStorage.setItem("uid", User._user.uid).then(() => {
        this.props.navigation.navigate("Main");
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  }
})
