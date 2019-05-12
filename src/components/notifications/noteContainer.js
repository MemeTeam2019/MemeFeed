import React from 'react';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

import Followed from './specifics/followed';
import Liked from './specifics/liked';
import Tagged from './specifics/tagged';

/**
 * Renders the meme poster or the subreddit from which a meme was pulled from.
 *
 * Used by:
 *    tile.js
 *    commentPage.js
 *
 * Props:
 *    sub (String): The subreddit the meme was pulled from.
 *    poster (String): The poster of the meme.
 *    likedFrom (String): The user the liker found the post from.
 */
class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('Users')
      .doc(this.props.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { username } = doc.data();
          this.setState({ username });
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  }

  render() {
    // if follow
    if (this.props.type=="follow") {
      return <Followed 
      who={this.state.username}
      uid={this.props.uid}
      viewed ={this.props.viewed} />;
    }
    // if like
    if (this.props.type=="like") {
      return (
        <Liked
          who={this.state.username}
          meme= {this.props.memeid}
          uid={this.props.uid}
          viewed ={this.props.viewed}
        />
      );
    }
    // if tag
    return (
      <Tagged
        who={this.state.username}
        meme= {this.props.memeid}
        uid={this.props.uid}
        viewed ={this.props.viewed}
      />
    );
  }
}

export default withNavigation(Notification);
