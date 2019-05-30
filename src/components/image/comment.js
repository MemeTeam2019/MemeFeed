import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

class Comment extends React.Component {
  handleUsernameClick = () => {
    this.props.navigation.navigate('FriendProfile', {
      uid: this.props.uid,
    });
  };

  navigateToUserProfile = (uid) => {
    this.props.navigation.push('FriendProfile', { uid });
  };

  parseTags = (content) => {
    const usernameToId = {};
    const words = content.split(' ');
    const usernamesTagged = this.props.usernamesTagged;
    const textChildren = [];
    let currStr = '';
    let found = false;
    let key = 0;

    usernamesTagged.forEach((username) => {
      firebase
        .firestore()
        .collection('Users')
        .where('username', '==', username)
        .get()
        .then((querySnapshot) => {
          const userDoc = querySnapshot.docs[0];
          usernameToId[username] = userDoc.id;
        });
    });

    words.forEach((word) => {
      usernamesTagged.forEach((username) => {
        if (word.indexOf(username) > -1 && word[0] === '@') {
          found = true;
          textChildren.push(
            <Text key={key++} style={styles.commentStyle}>
              {currStr + ' '}
            </Text>
          );
          textChildren.push(
            <Text
            key={key++}
              style={styles.userText}
              onPress={() => this.navigateToUserProfile(usernameToId[username])}
            >
              {`@${username}`}
            </Text>
          );
          textChildren.push(
            <Text key={key++} style={styles.commentStyle}>
              {word.substr(username.length + 1) + ' '}
            </Text>
          );
          currStr = '';
        }
      });
      if (!found) currStr += `${word} `;
    });
    if (currStr !== '')
      textChildren.push(
        <Text key={key} style={styles.commentStyle}>
          {currStr}
        </Text>
      );
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.handleUsernameClick()}>
          <Text style={styles.userText}>
            {this.props.username + '  '}
            <TouchableWithoutFeedback onPress={() => console.log('WOO')}>
              <Text>{textChildren}</Text>
            </TouchableWithoutFeedback>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View key={this.props.key}>{this.parseTags(this.props.content)}</View>
    );
  }
}

export default withNavigation(Comment);

const styles = StyleSheet.create({
  container: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    flexDirection: 'row',
    marginHorizontal: '2.5%',
    paddingTop: 10,
  },
  userText: {
    fontWeight: 'bold',
    color: 'black',
  },
  commentStyle: {
    fontWeight: 'normal',
    color: 'black',
  },
});
