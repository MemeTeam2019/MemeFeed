import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  YellowBox,
  AsyncStorage
} from "react-native";
import {Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
import ProfileGrid from '../components/userProfile/ProfileGrid';
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

  handleLogout = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate("Login");
    });
  }

  componentDidMount() {
    const authInfo = firebase.auth().currentUser;
    this.setState({
      email: authInfo.email,
      uid: authInfo.uid
    });
    const docRef = firebase.firestore().collection("Users").doc(authInfo.uid);
    docRef.get().then(User => {
      let data = User.data();
      console.log(data);
      this.setState(data);
      for (const key in data) {
        AsyncStorage.setItem(key, data[key].toString());
      }
    }).catch(err => {
      console.log(err);
    });

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

// <<<<<<< HEAD
      <React.Fragment>
      <View style={styles.containerStyle}>
        <View style={styles.navBar}>
          <Text style={styles.textSty4}>{this.state.username}</Text>
        </View>
        <View style={styles.profilePic}>
        <Image
        source={require('../images/proPic.png')} style={{ width: 70, height: 70}}/>
        <Text>      </Text>
        <Text>      </Text>
        <Text style={styles.textSty}> {this.state.followingCnt} {"\n"} <Text style={styles.textSty3}>Following</Text></Text>
        <Text>      </Text>
        <Text>      </Text>
        <Text style={styles.textSty}>{this.state.followersCnt} {"\n"} <Text style={styles.textSty3}>Followers</Text> </Text>
        </View>
        <View style={styles.profilePic}>
          <Text style={styles.textSty2}>{this.state.name}</Text>
          <Text>      </Text>
          <Text>      </Text>
          <Text style={styles.textSty5}>{" "}User Settings{"  "}</Text>
        </View>
        <View style={styles.textSty2}>
              <TouchableOpacity onPress={this.logout}>
              <Image
                source={require('../images/logout.png')} style={{ width: 50, height: 40}}
              />
              </TouchableOpacity>
        </View>
        <View style={styles.textSty2}>
            <Button
                title="Log Out"
                onPress={this.logout}
              />
        </View>
        <View style={styles.navBut}>
        <TouchableOpacity>
        <Image
        source={require('../images/fullFeedF.png')} style={{ width: 100, height: 50}}
// =======
//       <View style={styles.container}>
//         <Text>name: {this.state.name}</Text>
//         <Text>email: {this.state.email}</Text>
//         <Text>uid: {this.state.uid}</Text>
//         <Text>Following: {this.state.followingCnt}</Text>
//         <Text>Followers: {this.state.followersCnt}</Text>
//         <Button
//           title="Logout"
//           onPress={() => this.handleLogout()}
// >>>>>>> sprint2_term1
        />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../images/gridFeedF.png')} style={{ width: 100, height: 50}}
          />
        </TouchableOpacity>
        </View>

      </View>


      <ProfileGrid/>
      </React.Fragment>
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
    height:80,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50,//50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white'
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
    fontSize: 17,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    //borderColor: 'black',
    //borderWidth: 1,
    //borderRadius: 5,
  },
  textSty2: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
  },
  textSty3: {
    fontSize: 15,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: '#848180',
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  textSty5: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    borderColor: '#848180',
    color: '#848180',
    borderWidth: 1,
    borderRadius: 5,
  },
  profilePic: {
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 10,//50
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white'
  },
  textshadow:{
    fontSize:40,
    color:'#FFFFFF',
    fontFamily:'Times New Roman',
    paddingLeft:30,
    paddingRight:30,
    textShadowColor:'#585858',
    textShadowOffset:{width: 5, height: 5},
    textShadowRadius:20,
  },
})


/*

logout button:

<TouchableOpacity onPress={this.logout}>
<Image
source={require('../images/logout.png')} style={{ width: 50, height: 40}}
/>
</TouchableOpacity>

<Text>name: {this.state.name}</Text>
<Text>email: {this.state.email}</Text>
<Text>uid: {this.state.uid}</Text>
<Text>username: {this.state.username}</Text>
<Text>Following: {this.state.followingCnt}</Text>
<Text>Followers: {this.state.followersCnt}</Text>


*/
