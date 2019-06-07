import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';

/**
 * Touchable username which routes to the friendProfile of the user.
 *
 * @prop {String} uid: Firebase user id associated with this username component
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

  /**
   * Fetch the username associated with the uid passed down via props
   */
  componentDidMount() {
    const ref = firebase
      .firestore()
      .collection('Users')
      .doc(this.props.uid);

    ref
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          this.setState({ username: data.username });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Handle navigation to the appropriate profilePage
   */
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
