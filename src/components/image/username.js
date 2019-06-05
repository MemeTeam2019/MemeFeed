import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';

/**
 * Touchable username which routes to the friendProfile of the user.
 *
 * Used by:
 *     comment.js
 *     likedFromReddit.js
 *     likedFromUser.js
 *     sourceReddit.js
 * Props:
 *     uid (String): Firebase id of the user in question.
 */
class Username extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  componentDidMount() {
    this.userPromise = this.makeCancelable(
      firebase
        .firestore()
        .doc(`Users/${this.props.uid}`)
        .get()
    );
    this.userPromise.promise
      .then((userDoc) => {
        if (userDoc.exists)
          this.setState({ username: userDoc.data().username });
      })
      .catch((error) => console.log('woops'));
  }

  componentWillUnmount() {
    this.userPromise.cancel();
  }

  makeCancelable = (promise) => {
    let hasCanceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
      promise.then(
        (value) =>
          hasCanceled ? reject({ isCanceled: true, value }) : resolve(value),
        (error) => reject({ isCanceled: hasCanceled, error })
      );
    });
    return {
      promise: wrappedPromise,
      cancel: () => {
        hasCanceled = true;
      },
    };
  };

  goToUser() {
    // If going to our own profile
    if (this.props.uid === firebase.auth().currentUser.uid) {
      this.props.navigation.push('Profile', {
        uid: this.props.uid,
      });
    } else {
      this.props.navigation.push('FriendProfile', {
        uid: this.props.uid,
      });
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.goToUser()}>
        <Text style={styles.text}> {this.state.username}</Text>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Username);

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'AvenirNext-Regular',
    fontWeight: '600',
    marginRight: '2.5%',
  },
});
