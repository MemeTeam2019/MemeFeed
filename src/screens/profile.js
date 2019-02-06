import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity
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
      <View style={styles.containerStyle}>
        <View style={styles.navBar}>
          <Image source={require('../images/banner3.png')} style={{ width: 250, height: 50}} />
          <TouchableOpacity onPress={this.logout}>
          <Image
          source={require('../images/logout.png')} style={{ width: 50, height: 40}}
          />
          </TouchableOpacity>
        </View>
        <View style={styles.textSty}>
        <Text>DropDown</Text>
        </View>
        <View style={styles.textSty}>
                <Text>name: {this.state.name}</Text>
                <Text>email: {this.state.email}</Text>
                <Text>uid: {this.state.uid}</Text>
                <Text>username: {this.state.username}</Text>
                <Text>Following: {this.state.followingCnt}</Text>
                <Text>Followers: {this.state.followersCnt}</Text>
                <Button
                  title="Log Out"
                  onPress={this.logout}
                />
              </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  headerSty: {
    height: 80,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50,//50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
  },
  navBar: {
    height:100,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50,//50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBut: {
    height:50,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSty: {
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white'
  }
})
