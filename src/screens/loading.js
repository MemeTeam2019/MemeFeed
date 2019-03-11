import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import firebase from "react-native-firebase";

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
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
  loading: {
    fontSize: 24,
    padding: 20
  }
})

export default LoadingScreen;
