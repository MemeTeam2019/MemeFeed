import React, { Component } from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import LikedFromReddit from './tileHeaders/LikedFromReddit';
import LikedFromUser from './tileHeaders/LikedFromUser';
import SourceReddit from './tileHeaders/SourceReddit';

import firebase from 'react-native-firebase';
 
class TileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    }
  }

  componentDidMount() {
    var userRef = firebase.firestore().collection("Users").doc(this.props.likedFrom);
    var getDoc = userRef.get()
    .then(doc => {
      if (doc.exists) {
        const { username } = doc.data();
        this.setState({
          username,
        });
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  }

  render() {
    console.log(this.props.likedFrom)
    // if meme is just from a sub reddit
    if (this.props.sub) {
      return (
        <SourceReddit sub={this.props.sub}/>
      );
    }
    // if meme liked from reddit
    else if (this.state.username == "") {
      return (
        <LikedFromReddit poster={this.props.poster} sub={this.props.likedFrom}/>
      );
    } 
    // if meme liked from user
    else {
      return (
        <LikedFromUser poster={this.props.poster} likedFrom={this.props.likedFrom}/>
      );
    }
  }
}

export default withNavigation(TileHeader);
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5
  },
  containerA: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    height: 100,
    alignItems: 'center',
    marginTop: 30
  },
  text: {  
    fontSize: 16,
    fontFamily: 'AvenirNext-Bold',
    marginLeft: 10
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  likedFromImg: {
    width: 30,
    height: 30,
    borderRadius: 15
  }
});
