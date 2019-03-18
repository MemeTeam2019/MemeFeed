import React from 'react';
import { withNavigation } from 'react-navigation';

import LikedFromReddit from './tileHeaders/likedFromReddit';
import LikedFromUser from './tileHeaders/likedFromUser';
import SourceReddit from './tileHeaders/sourceReddit';

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
          username: username,
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
 