import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import firebase from 'react-native-firebase';

/**
 * Touchable username which routes to the friendProfile of the user.
 *
 * Used by:
 *     comment.js
 *     likedFromReddit.js
 *     likedFromUser.js
 *     sourceReddit.js
 *
 * Props:
 *     uid (String): Firebase id of the user in question.
 */
class Username2 extends React.Component {
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
          let data = docSnapshot.data();
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
    if (this.props.uid == firebase.auth().currentUser.uid) {
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
        <Text style={styles.text}>{this.state.username}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: '2.5%',
    color: '#919191',
    backgroundColor: 'transparent',
    fontWeight: '600',
  },
});

export default Username2;
