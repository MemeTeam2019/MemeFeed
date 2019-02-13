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
  Platform,
  ActionSheetIOS,
  UIManager,
  TextInput,
} from "react-native";

import firebase from "react-native-firebase";

import ActionSheet from 'react-native-actionsheet';


export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      name: "",
      uid: "",
      followingCnt: 0,
      followersCnt: 0,
      open: false,
      selectGridButtonP: true,
      selectListButtonP: false,
    }
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

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

  onGridViewPressedP = () => {
    this.setState({selectGridButtonP: true})
    this.setState({selectListButtonP: false})
  }

  onListViewPressedP = () => {
    this.setState({selectGridButtonP: false})
    this.setState({selectListButtonP: true})
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
    var optionArray = [
      'Logout',
      'Cancel',
    ];
    return (
      <View style={styles.container}>
        {/*Display Username top center*/}
        <View style={styles.navBar}>
          <Text style={styles.textSty4}>{this.state.username}</Text>
        </View>
        {/*Profile Pic, Follwers, Follwing Block*/}
        <View style={styles.profilePic}>
        {/*PROFILE PICTURE*/}
        <Image
        source={require('../images/profilePic.png')} style={{width: 85, height: 85, borderRadius: 85/2}}/>
        <Text>      </Text>
        {/*FOLLOWING*/}
        <Text style={styles.textSty}> {this.state.followingCnt} {"\n"} <Text style={styles.textSty3}>Following</Text></Text>
        <Text>      </Text>
        <Text>      </Text>
        {/*FOLLOWERS*/}
        <Text style={styles.textSty}>{this.state.followersCnt} {"\n"} <Text style={styles.textSty3}>Followers</Text> </Text>
        </View>
        {/*DISPLAY NAME*/}
        <View style={styles.profilePic}>
          <Text style={styles.textSty2}>{this.state.name}</Text>
          <Text>      </Text>
          <Text>      </Text>
          <Button
            onPress={this.showActionSheet}
            title="User Settings"
            />
            <ActionSheet
              ref={o => (this.ActionSheet = o)}
              title={'User Settings'}
              options={optionArray}
              cancelButtonIndex={1}
              destructiveIndex={0}
              onPress={index => {
                if (optionArray[index] == 'Logout'){
                  this.logout();
                }
              }}
            />
        </View>
        {/*DIFFERENT VIEW TYPE FEED BUTTONS*/}
        <View style={styles.navBut}>
        <TouchableOpacity onPress={() => this.onListViewPressedP()}>
        <Image
        source={require('../images/fullFeedF.png')} style={{ opacity:  this.state.selectListButtonP
                                                              ? 1 : 0.3,
                                                            width: 100, height: 50}}
        />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.onGridViewPressedP()}>
        <Image
        source={require('../images/gridFeedF.png')} style={{ opacity:  this.state.selectGridButtonP
                                                              ? 1 : 0.3,
                                                            width: 100, height: 50}}
        />
        </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
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
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812',
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
    //fontWeight: 'bold',
    //color: '#778899',
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue-Bold',
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
    borderColor: '#778899',
    color: '#778899',
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

<Text>name: {this.state.name}</Text>
<Text>email: {this.state.email}</Text>
<Text>uid: {this.state.uid}</Text>
<Text>username: {this.state.username}</Text>
<Text>Following: {this.state.followingCnt}</Text>
<Text>Followers: {this.state.followersCnt}</Text>

//*/
