import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';

class Comment extends React.Component {
  handleUsernameClick() {
    this.props.navigation.push('FriendProfile', {
      uid: this.props.uid,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.handleUsernameClick()}>
          <Text style={styles.userText}>{this.props.username}</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback>
          <Text style={styles.commentStyle}>{this.props.content}</Text>
        </TouchableWithoutFeedback>
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
    paddingTop: 10,
  },
  userText: {
    fontWeight: 'bold',
    color: 'black',
    marginRight: 5,
  },
  commentStyle: {
    fontWeight: 'normal',
    color: 'black',
  },
});
