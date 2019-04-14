import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import firebase from 'react-native-firebase';

import ButtonBar from './buttonBar';
import Comment from './comment';

class CommentList extends React.Component {
  constructor() {
    super();
    this.renderComment.bind(this);
    this.state = {
      commentsLoaded: 0,
      commentCount: 0,
      comments: [],
    };
  }

  componentDidMount() {
    // Grab total # of comments
    const countRef = firebase
      .firestore()
      .collection(`Comments/${this.props.memeId}/Info`)
      .doc('CommentInfo');
    countRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { count } = doc.data();
          this.setState({
            commentCount: count,
          });

          firebase
            .firestore()
            .collection(`Comments/${this.props.memeId}/Text`)
            .orderBy('time', 'desc') // we choose decsending to get most recent
            .limit(Math.min(this.state.commentCount, 5))
            .get()
            .then(this.updateComments);
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  }

  fetchComments = () => {
    const oldestDoc = this.state.oldestDoc;
    if (oldestDoc) {
      firebase
        .firestore()
        .collection(`Comments/${this.props.memeId}/Text`)
        .orderBy('time', 'desc')
        .limit(5)
        .startAfter(oldestDoc)
        .get()
        .then(this.updateComments);
    }
  };

  updateComments = (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const { text, uid, time } = doc.data();
      const userRef = firebase
        .firestore()
        .collection('Users')
        .doc(uid);

      userRef
        .get()
        .then((user) => {
          const newComments = [];
          const { username } = user.data();
          newComments.push({
            key: doc.id,
            uid: user.id,
            doc: user,
            content: text,
            time,
            username,
          });
          this.setState((prevState) => {
            const mergedComments = newComments.concat(prevState.comments);
            return {
              comments: mergedComments,
              commentsLoaded: mergedComments.length,
              oldestDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  // Single comment
  renderComment = ({ item }) => {
    return (
      <Comment
        key={item.key}
        username={item.username}
        content={item.content}
        uid={item.uid}
      />
    );
  };

  render() {
    // if there are more comments to load
    if (this.state.commentsLoaded < this.state.commentCount) {
      return (
        <View style={[styles.containerStyle]}>
          <ButtonBar memeId={this.props.memeId} />
          <TouchableOpacity
            onPress={this.fetchComments}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={styles.buttonSty}>Load more comments</Text>
          </TouchableOpacity>
          <FlatList
            data={this.state.comments}
            renderItem={this.renderComment}
          />
        </View>
      );
    }
    // no more comments to load
    return (
      <View style={[styles.containerStyle]}>
        <ButtonBar memeId={this.props.memeId} />
        <FlatList data={this.state.comments} renderItem={this.renderComment} />
      </View>
    );
  }
}

export default CommentList;

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 50,
    bottom: 50,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  buttonSty: {
    paddingTop: 10,
    fontSize: 15,
    fontFamily: 'AvenirNext-Bold',
    textAlign: 'center',
  },
  loadMore: {
    height: 40,
    width: 205,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
