import React from 'react';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
import { TouchableOpacity } from 'react-native';
import Followed from './specifics/followed';
import Liked from './specifics/liked';
import Tagged from './specifics/tagged';

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewed: this.props.viewed,
    };
  }

  /**
   * Update the 'viewed' field of a notification to true
   */
  updateViewedStatus = () => {
    const myUid = firebase.auth().currentUser.uid;
    const notificationId = this.props.notificationId;
    this.setState({ viewed: true });
    firebase
      .firestore()
      .doc(`Notifications/${myUid}/Notes/${notificationId}`)
      .update({ viewed: true });
  };

  /**
   * Navigate to the profile of the person who followed you
   */
  handleFollowed = () => {
    this.updateViewedStatus();
    this.props.navigation.push('FriendProfile', {
      uid: this.props.uid,
    });
  };

  /**
   * Navigate to the meme associated with this notification
   */
  handleLiked = () => {
    firebase
      .firestore()
      .collection('Memes')
      .doc(this.props.memeId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let data = {};
          const { url, time, sub, author, caption } = doc.data();
          if (sub) {
            data = {
              memeId: doc.id,
              key: doc.id,
              doc,
              uri: url,
              time,
              sub,
              postedBy: sub,
              caption,
            };
          } else {
            data = {
              memeId: doc.id,
              key: doc.id,
              doc,
              uri: url,
              time,
              poster: author,
              postedBy: author,
              caption,
            };
          }
          this.updateViewedStatus();
          this.props.navigation.push('Comment', data);
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  };

  /**
   * Navigate to the meme for which the person was tagged in
   */
  handleTagged = () => {
    firebase
      .firestore()
      .collection('Memes')
      .doc(this.props.memeId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let data = {};
          const { url, time, sub, author, caption } = doc.data();
          if (sub) {
            data = {
              memeId: doc.id,
              key: doc.id,
              doc,
              uri: url,
              time,
              sub,
              postedBy: sub,
              caption,
            };
          } else {
            data = {
              memeId: doc.id,
              key: doc.id,
              doc,
              uri: url,
              time,
              poster: author,
              postedBy: author,
              caption,
            };
          }
          this.updateViewedStatus();
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
          <Followed
            uid={this.props.uid}
            time={this.props.time}
            viewed={this.state.viewed}
          />
        </TouchableOpacity>
      );
    }
    // if like
    if (this.props.type === 'like') {
      return (
        <TouchableOpacity onPress={this.handleLiked}>
          <Liked
            memeId={this.props.memeId}
            uid={this.props.uid}
            time={this.props.time}
            viewed={this.state.viewed}
          />
        </TouchableOpacity>
      );
    }
    // if tag
    return (
      <TouchableOpacity onPress={this.handleTagged}>
        <Tagged
          memeId={this.props.memeId}
          uid={this.props.uid}
          time={this.props.time}
          viewed={this.state.viewed}
        />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Notification);
