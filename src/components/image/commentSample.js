import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import firebase from 'react-native-firebase';

import Comment from './comment';

class CommentSample extends React.Component {
  constructor() {
    super();
    this.unsubscribe = null;
    this.state = {
      comments: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase
      .firestore()
      .collection(`Comments/${this.props.memeId}/Text`)
      .orderBy('time', 'desc')
      .limit(2) // we choose decsending to get most recent
      .get()
      .then(this.onCollectionUpdate);
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const comments = [];

    querySnapshot.forEach((doc) => {
      const { text, uid, time } = doc.data();
      console.log('\n\n\n~~~~~~~~~~~' + text + ' ' + time + ' ' + '\n\n\n');

      firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            console.log(`No such user ${uid} exist!`);
          } else {
            const { username } = doc.data();
            comments.push({
              key: doc.id,
              doc, // DocumentSnapshot
              content: text,
              time,
              username,
            });

            // resort comments since nested asynchronous function
            const compareTime = (a, b) => {
              console.log('sorting comments bb');
              if (a.time < b.time) return -1;
              if (a.time > b.time) return 1;
              return 0;
            };

            this.setState({
              comments: comments.sort(compareTime),
            });
          }
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
    });
  };

  // Single comment
  renderComment = ({ item }) => {
    return (
      <Comment
        username={item.username}
        content={item.content}
        uid={item.key}
        key={item.key}
      />
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <FlatList
          data={this.state.comments}
          renderItem={this.renderComment.bind(this)}
        />
      </View>
    );
  }
}

export default CommentSample;

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
});
