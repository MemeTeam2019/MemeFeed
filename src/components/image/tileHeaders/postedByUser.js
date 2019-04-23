import React, { Component } from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import Username from '../username';
import Username2 from '../username2';
import ActionSheet from 'react-native-actionsheet';

import firebase from 'react-native-firebase';

class postedByUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      iconURL: ''
    }
  }

  componentDidMount() {
    const uid = this.props.poster;
    const userRef = firebase.firestore().collection("Users").doc(uid);
    //get the profile icon
    firebase
    .firestore()
    .collection('Users')
    .doc(uid)
    .get()
    .then((docSnapshot) => {
      if(docSnapshot.exists) {
        const { icon } = docSnapshot.data();
          this.state.iconURL = icon
        console.log(this.state.iconURL)
        console.log(icon)
      }
      else{
        console.log("doesn't exist")
      }
    })
    .catch((error) => {
      console.log(error);
    });
    userRef.get().then(snapshot => {
      const data = snapshot.data();
      this.setState({username: data.username})
    })
    .catch(err => console.log(err));
  }


  showActionSheet = () => {
    this.ActionSheet.show();
  };

  navigateToFriendProfile() {
    this.props.navigation.navigate("FriendProfile", {
      uid: this.props.poster
    });
  }

  render() {
    var optionArray = ['Inappropriate/Irrelevant', 'Cancel'];
    // if there is someone that was liked from
    return (

        <View style={styles.navBar1}>
          <View style={styles.leftContainer1}>
            <View style={styles.container}>
              <Text ststyle={styles.text}> Posted by </Text>
              <Image
                style={styles.userImg}
                source={{uri: this.state.iconURL}}
              />
              <Username uid={this.props.poster} navigation={this.props.navigation} />
            </View>
          </View>
          <Text style={styles.textSty4}></Text>
          <View style={styles.rightContainer1}>
            <View style={styles.rightIcon1} />
            <TouchableOpacity onPress={this.showActionSheet}>
              <Text>... </Text>
            </TouchableOpacity>
            <ActionSheet
              ref={(o) => (this.ActionSheet = o)}
              options={optionArray}
              cancelButtonIndex={1}
              destructiveIndex={0}
              onPress={(index) => {
                if (optionArray[index] == 'Inappropriate/Irrelevant') {

                }
              }}
            />
          </View>
        </View>

    );
  }
}

export default withNavigation(postedByUser);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  containerA: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    alignItems: 'center',
    marginTop: 30,
    borderBottomWidth: .5,
    borderColor: '#D6D6D6',
    //borderTopWidth: .5,
    paddingTop: 7
  },
  text: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Bold',
    marginLeft: 10
  },
  userImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 2
  },
  likedFromImg: {
    width: 30,
    height: 25,
  },
  button: {
    flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
  },
  navBar1: {
    height: 95,
    paddingTop: 50, //50
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  leftContainer1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  rightContainer1: {
    flex: 1,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 10
  },
  rightIcon1: {
    height: 10,
    width: 20,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Bold',
    marginLeft: '2.5%',
  },
});
