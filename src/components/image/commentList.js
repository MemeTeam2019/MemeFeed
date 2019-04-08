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
    this.unsubscribe = null;
    this.renderComment.bind(this);

    this.state = {
      commentsLoaded: 10,
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

          this.unsubscribe = firebase
            .firestore()
            .collection(`Comments/${this.props.memeId}/Text`)
            .orderBy('time', 'desc') // we choose decsending to get most recent
            .limit(Math.min(this.state.commentCount, this.state.commentsLoaded))
            .onSnapshot(this.onCollectionUpdate);
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // Function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const comments = [];

    querySnapshot.forEach((doc) => {
      const { text, uid, time } = doc.data();

      const userRef = firebase
        .firestore()
        .collection('Users')
        .doc(uid);

      userRef
        .get()
        .then((docSnapshot) => {
          if (!docSnapshot.exists) {
            console.log(`No such user ${uid} exist!`);
          } else {
            const { username } = docSnapshot.data();
            comments.push({
              key: doc.id,
              doc, // DocumentSnapshot
              content: text,
              time,
              username,
            });

            this.setState({
              comments: comments.sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
              }),
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
      <Comment username={item.username} content={item.content} uid={item.key} />
    );
  };

  render() {
    // if there are more comments to load
    if (this.state.commentsLoaded < this.state.commentCount) {
      return (
        <View style={[styles.containerStyle]}>
          <ButtonBar memeId={this.props.memeId} />
          <TouchableOpacity
            onPress={() => {
              this.setState((prevState) => {
                return {
                  commentsLoaded: prevState.commentsLoaded + 10,
                  comments: [],
                };
              });
              this.componentDidMount();
            }}
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
