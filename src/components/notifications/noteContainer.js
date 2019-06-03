import React from 'react';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
import { TouchableOpacity } from 'react-native';
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
  /**
   * Update the 'viewed' field of a notification to true
   */
  updateSeenStatus = () => {
    const myUid = firebase.auth().currentUser.uid;
    const notificationId = this.props.notificationId;
    firebase
      .firestore()
      .doc(`NotificationsTest/${myUid}/Notes/${notificationId}`)
      .update({ viewed: true });
  };

  /**
   * Navigate to the profile of the person who followed you
   */
  handleFollowed = () => {
    this.props.navigation.push('FriendProfile', {
      uid: this.props.uid,
    });
  };

  handleLiked = () => {
    firebase
      .firestore()
      .collection('MemesTest')
      .doc(this.props.memeId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const {
            src,
            time,
            sub,
            caption,
            likedFrom,
            postedBy,
            poster,
          } = doc.data();
          console.log(doc.data());
          this.props.navigation.push('Comment', {
            memeId: doc.id,
            uri: src,
            sub,
            likedFrom,
            postedBy,
            poster,
            caption,
            time,
          });
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  };

  handleTagged = () => {
    firebase
      .firestore()
      .collection('MemesTest')
      .doc(this.props.memeId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { url, time, sub } = doc.data();
          const data = { key: doc.id, doc, src: url, time, sub, postedBy: sub };
          console.log(data);
          this.props.navigation.push('Comment', data);
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  };

  render() {
    // if follow
    if (this.props.type === 'follow') {
      return (
        <TouchableOpacity onPress={this.handleFollowed}>
          <Followed uid={this.props.uid} viewed={this.props.viewed} />
        </TouchableOpacity>
      );
    }
    // if like
    if (this.props.type === 'like') {
      return (
        <TouchableOpacity onPress={this.handleLiked}>
          <Liked
            meme={this.props.memeId}
            uid={this.props.uid}
            viewed={this.props.viewed}
          />
        </TouchableOpacity>
      );
    }
    // if tag
    return (
      <TouchableOpacity onPress={this.handleTagged}>
        <Tagged
          meme={this.props.memeId}
          uid={this.props.uid}
          viewed={this.props.viewed}
        />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Notification);
