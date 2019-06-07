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

/**
 * Comment component
 * A single comment with navigation and tagging capabilities
 * 
 * Used by:
 *   commentList.js
 *   commentSample.js
 * 
 * Props:
 *   uid (String): the identification of the user associated with the comment
 *   username (String): the username associated with the uid of the user who commenteds
 */

class Comment extends React.Component {
  handleUsernameClick = () => {
    this.props.navigation.navigate('FriendProfile', {
      uid: this.props.uid,
    });
  };

  navigateToUserProfile = (uid) => {
    this.props.navigation.push('FriendProfile', { uid });
  };

  //parseTags() looks for tags in the comment, a string that starts with @
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
    /** 
     * for each word in the comment, 
     *    if the word starts with @, save the words before it in currStr and push to the textChildren array
     *    push the username into textChildren. This will have its own styling and navigation
     *    then push the rest of the comment into textChildren
    */
    words.forEach((word) => {
      found = false;
      for (let i = 0; i < usernamesTagged.length; ++i) {
        const username = usernamesTagged[i];
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
          break;
        }
      }
      if (!found) {
        currStr += `${word} `;
      }
    });
    //if the currStr is not a username or empty, push into textChildren with commentStyle
    if (currStr !== '')
      textChildren.push(
        <Text key={key} style={styles.commentStyle}>
          {currStr}
        </Text>
      );
    //This is what will be seen on the UI. The username, and then the textChildren array
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.handleUsernameClick()}>
          <Text style={styles.usernameText}>
            {this.props.username + ' '}
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
    paddingTop: '1.5%',
  },
  usernameText: {
    fontWeight: '700',
    color: 'black',
  },
  userText: {
    fontWeight: '500',
    fontStyle: 'italic',
    color: 'black',
  },
  commentStyle: {
    fontWeight: 'normal',
    color: 'black',
  },
});
