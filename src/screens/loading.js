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
      if (User) {
        this.props.navigation.navigate("Main");
      } else {
        this.props.navigation.navigate("Auth");
      }
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
