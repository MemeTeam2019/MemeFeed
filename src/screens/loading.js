import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import {NavigationEvents} from "react-navigation";
import firebase from "react-native-firebase";

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (!user) {
      this.props.navigation.navigate("Auth");
    } else {
      this.props.navigation.navigate("Main")
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <ActivityIndicator size="large"/>
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
  },
  loadingText: {
    fontSize: 36
  }
})
