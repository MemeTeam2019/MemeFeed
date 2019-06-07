import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import firebase from 'react-native-firebase';

import Comment from './comment';

class CommentSample extends React.Component {
  constructor(props) {
    super(props);
    this.renderComment = this.renderComment.bind(this);
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
      .limit(2) // We choose decsending to get most recent
      .get()
      .then(this.onCollectionUpdate);
  }

  /**
   * Extracts a QuerySnapshot from the Comments collection
   * @param {QuerySnapshot} commentsSnapshot: A QuerySnapshot obtained from the Text collection of this memeId
   */
  onCollectionUpdate = (commentsSnapshot) => {
    const comments = [];

    commentsSnapshot.forEach((commentDoc) => {
      const { text, uid, time, usernamesTagged } = commentDoc.data();
      firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then((userDoc) => {
          if (!userDoc.exists) {
            console.log(`No such user ${uid} exist!`);
          } else {
            const { username } = userDoc.data();
            comments.push({
              key: commentDoc.id,
              username,
              content: text,
              time,
              usernamesTagged: usernamesTagged || [],
            });

            // resort comments since nested asynchronous function
            const compareTime = (a, b) => {
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

  /**
   * Renders a single Comment item.
   * @param {Object} item: Data extracted from this.state.comments, produced by onCollectionUpdate
   * @returns {Comment} A comment object
   */
  renderComment = ({ item }) => {
    return (
      <Comment
        key={item.key}
        uid={item.uid}
        username={item.username}
        content={item.content}
        usernamesTagged={item.usernamesTagged}
      />
    );
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        <FlatList
          data={this.state.comments}
          renderItem={this.renderComment}
          keyExtractor={(_, index) => index.toString()}
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
