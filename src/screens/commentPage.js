import React from 'react';
import { StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import firebase from 'react-native-firebase';

import Tile from '../components/image/tile';
import AddComment from '../components/image/addComment';
import CommentList from '../components/image/commentList';
import TileHeader from '../components/image/tileHeader';
import Photo from '../components/image/photo';
import ButtonBar from '../components/image/buttonBar';

/**
 * Display comments for a meme, along with the buttonBar and the meme itself.
 *
 * Props
 * -----
 * navigtion.uri: String
 * navigation.memeId: String
 */
class CommentPage extends React.Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.showAllComments=1;
    this.scrollView = null;
    this.fetchComments = this.fetchComments.bind(this);
    this.handleNewComment = this.handleNewComment.bind(this);
    this.state = {
      imageuri: this.props.navigation.getParam('uri', null),
      memeId: this.props.navigation.getParam('memeId', null),
      comments: [],
      commentCount: 0,
      commentsLoaded: 0,
      oldestDoc: null,
    };
  }

  componentDidMount() {
    // Grab total # of comments
    const countRef = firebase
      .firestore()
      .collection(`Comments/${this.state.memeId}/Info`)
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
            .collection(`Comments/${this.state.memeId}/Text`)
            .orderBy('time', 'desc') // we choose decsending to get most recent
            .limit(Math.min(this.state.commentCount, 5))
            .get()
            .then((querySnapshot) => this.updateComments(querySnapshot));
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  }

  /**
   * Fetch the next latest comments based on the oldest comment
   * already fetched
   */
  fetchComments = () => {
    const oldestDoc = this.state.oldestDoc;
    if (oldestDoc) {
      firebase
        .firestore()
        .collection(`Comments/${this.state.memeId}/Text`)
        .orderBy('time', 'desc')
        .limit(5)
        .startAfter(oldestDoc)
        .get()
        .then(this.updateComments);
    }
  };

  /**
   * Extract data from firebase QuerySnapshot to this.state.comments
   */
  updateComments = (querySnapshot) => {
    const newComments = [];
    querySnapshot.docs.forEach((doc) => {
      const { text, uid, time } = doc.data();
      console.log(text, uid, time);
      const userRef = firebase
        .firestore()
        .collection('Users')
        .doc(uid);

      newComments.push(
        userRef
          .get()
          .then((user) => {
            const { username } = user.data();
            return {
              key: doc.id,
              uid: user.id,
              doc: user,
              content: text,
              time,
              username,
            };
          })
          .catch((error) => {
            console.log(error);
          })
      );
    });
    Promise.all(newComments).then((resolvedComments) => {
      // resolvedComments.sort((a, b) => a.time < b.time);
      resolvedComments.reverse();
      this.setState((prevState) => {
        const mergedComments = resolvedComments.concat(prevState.comments);
        console.log(mergedComments);
        return {
          comments: mergedComments,
          commentsLoaded: mergedComments.length,
          oldestDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        };
      });
    });
  };

  /**
   * When a user posts a new comment, render it in the CommentList
   * to give visual feedback
   */
  handleNewComment = (commentRef) => {
    commentRef.get().then((commentDoc) => {
      const { text, uid, time } = commentDoc.data();
      console.log(text, uid, time);
      firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then((userDoc) => {
          const { username } = userDoc.data();
          const newComment = {
            key: commentDoc.id,
            uid,
            doc: userDoc,
            content: text,
            time,
            username,
          };
          console.log(newComment);
          this.setState((prevState) => {
            return {
              comments: [...prevState.comments, newComment],
              commentsLoaded: prevState.commentsLoaded + 1,
              commentCount: prevState.commentCount + 1,
            };
          });
        });
    });
  };

  render() {
    const sub = this.props.navigation.getParam('sub', '');
    const likedFrom = this.props.navigation.getParam('likedFrom', '');
    const postedBy = this.props.navigation.getParam('postedBy', '');
    const poster = this.props.navigation.getParam('poster', '');
    return (
      <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={95}>
        <ScrollView
          ref={(ref) => {
            this.scrollView = ref;
          }}
          style={{ height: '100%' }}
        >
          <Tile
            memeId={this.state.memeId}
            imageUrl={this.state.imageuri}
            sub={sub}
            likedFrom={likedFrom}
            postedBy={postedBy}
            poster={poster}
            showAllComments={this.showAllComments}
          />
          {/* <TileHeader
            sub={sub}
            likedFrom={likedFrom}
            postedBy={postedBy}
            poster={poster}
          />
          <Photo imageUrl={this.state.imageuri} />
          <ButtonBar memeId={this.state.memeId} /> */}
          <CommentList
            memeId={this.state.memeId}
            comments={this.state.comments}
            fetchComments={this.fetchComments}
            commentsLoaded={this.state.commentsLoaded}
            commentCount={this.state.commentCount}
          />
        </ScrollView>
        <AddComment
          memeId={this.state.memeId}
          handleNewComment={this.handleNewComment}
          style={styles.addComment}
        />
      </KeyboardAvoidingView>
    );
  }
}

export default CommentPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  addComment: {
    position: 'absolute',
  },
});
