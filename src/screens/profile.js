import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button
} from "react-native";
import firebase from "react-native-firebase";

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      name: "",
      uid: "",
      followingCnt: 0,
      followersCnt: 0
    }
  }

  componentDidMount() {
    const authInfo = firebase.auth().currentUser;
    this.setState({
      email: authInfo.email,
      uid: authInfo.uid
    });
    const docRef = firebase.firestore().collection("Users").doc(authInfo.uid);
    docRef.get().then((User) => {
      this.setState(User.data());
    }).catch((err) => {
      console.log(err);
    })
  }

  logout = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate("Auth");
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>name: {this.state.name}</Text>
        <Text>email: {this.state.email}</Text>
        <Text>uid: {this.state.uid}</Text>
        <Text>Following: {this.state.followingCnt}</Text>
        <Text>Followers: {this.state.followersCnt}</Text>
        <Button
          title="Log Out"
          onPress={this.logout}
        />
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