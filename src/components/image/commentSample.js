import React from 'react';
import { View, StyleSheet } from 'react-native';
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
      .collection(`CommentsTest/${this.props.memeId}/Text`)
      .orderBy('time', 'desc')
      .limit(2) // we choose decsending to get most recent
      .get()
      .then(this.updateComments);
  }

  /**
   * Extract information for each comment into this.state.comments
   *
   * @param {QuerySnapshot} commentsSnapshot: from `CommentsTest/{uid}/Text`
   * @returns {null}
   */
  updateComments = (commentsSnapshot) => {
    const comments = [];
    commentsSnapshot.forEach((doc) => {
      const { text, uid, time } = doc.data();
      firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then((userDoc) => {
          if (!doc.exists) {
            console.log(`No such user ${uid} exist!`);
          } else {
            const { username } = userDoc.data();
            comments.push({
              key: doc.id,
              uid,
              userDoc, // DocumentSnapshot
              content: text,
              time,
              username,
            });
          }
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
    });
    this.setState({ comments });
  };

  /**
   * Renders a single comment item wrapped in a <View> tag.
   *
   * @param {Object} item: Element of this.state.comments, obtained from updateComments
   * @returns {JSXElement} Comment component wrapped in a <View>
   */
  renderComment = (item) => {
    return (
      <View key={item.key}>
        <Comment
          key={item.key}
          uid={item.uid}
          username={item.username}
          content={item.content}
        />
      </View>
    );
  };

  render() {
    const { comments } = this.state;
    return (
      <View style={styles.containerStyle}>
        {comments.map((comment) => this.renderComment(comment))}
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
