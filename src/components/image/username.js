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

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;

    const ref = firebase
      .firestore()
      .collection('Users')
      .doc(this.props.uid);

    ref
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          if (data && this._isMounted) {
            this.setState({ username: data.username });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

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
    fontFamily: 'AvenirNext-Bold',
    marginLeft: '2.5%',
    color: 'black',
  },
});
