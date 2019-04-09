import React, { Component } from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import Username from '../username';

import firebase from 'react-native-firebase';

class LikedFromReddit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    }
  }

  componentDidMount() {
    const uid = this.props.poster;
    const userRef = firebase.firestore().collection("Users").doc(uid);
    userRef.get().then(snapshot => {
      const data = snapshot.data();
      this.setState({username: data.username})
    })
    .catch(err => console.log(err));
  }

  navigateToFriendProfile() {
    this.props.navigation.navigate("FriendProfile", {
      uid: this.props.poster
    });
  }

  render() {
    // if just from reddit (a.k.a. on the explore page)
    console.log(this.props.sub)
    return (
      <View style={styles.containerA}>
        <View style={styles.container}>
          <Image
            style={styles.userImg}
            source={{uri:'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'}}
          />
          <Username uid={this.props.poster} navigation={this.props.navigation} />
          <Image
            style={styles.likedFromImg}
            source={require('../repostIcon.png')}
          />
          <Text style={{fontSize: 13, fontWeight: 'bold', fontStyle: 'italic', color: '#919191'}}> 'r/{this.props.sub}'</Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(LikedFromReddit);

const styles = StyleSheet.create({
   container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5
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
  }

});
