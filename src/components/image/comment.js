import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase'; 

class Comment extends React.Component {
  handleUsernameClick() {
    this.props.navigation.push('FriendProfile', {
      uid: this.props.uid,
    });
  }

  parseTags = (content) => {
    const usernameToId = {}
    const words = content.split(' ')
    words.forEach(word => {
      if(word[0] == '@'){
        const username = word.substr(1);
        firebase
        .firestore()
        .collection('Users')
        .where('username', '==', username)
        .get()
        .then((querySnapshot) => {
          const userDoc = querySnapshot.docs[0];
          usernameToId[username] = userDoc.id;
        });
      }
    })
    const textChildren = []
    let currStr = ''
    words.forEach(word => {
      if(word[0] == '@'){
        textChildren.push(<Text style={styles.commentStyle}>{currStr}</Text>)
        textChildren.push(
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('FriendProfile', {
                uid: usernameToId[word.substr(1)]
              });
            }}>
              <Text style={{fontWeight: 'bold'}}>
                {word + ' '}
              </Text>
          </TouchableOpacity>
        );
        currStr = ''
      } else {
        currStr += word + ' '
      }
    })
    if (currStr !== '') textChildren.push(<Text style={styles.commentStyle}>{currStr}</Text>);
    return (
      <View  style={styles.container}>
      <TouchableOpacity onPress={() => this.handleUsernameClick()}>
        <Text style={styles.userText}>
          {this.props.username + '  '}
        </Text>
      </TouchableOpacity>
      {textChildren}
      </View>      
    );
  }

  render() {
    return (
      <View>
        {this.parseTags(this.props.content)}
      </View>
    );
  }
}

export default withNavigation(Comment);

const styles = StyleSheet.create({
  container: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    flexDirection: 'row',
    marginLeft: '2.5%',
    marginRight: '2.5%',
    paddingTop: 10,
  },
  userText: {
    fontWeight: 'bold',
    color: 'black'
  },
  commentStyle: {
    fontWeight: 'normal',
    color: 'black',
  },
});
