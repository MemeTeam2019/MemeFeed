import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Button,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import firebase from 'react-native-firebase';

import Tile from '../components/image/tile';
import CommentList from '../components/image/commentList';
import AtResult from '../components/image/atResult';

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
    this.showAllComments = 1;
    this.scrollView = null;
    this.fetchComments = this.fetchComments.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
    this.tagPerson = this.tagPerson.bind(this);
    this.state = {
      imageuri: this.props.navigation.getParam('uri', null),
      memeId: this.props.navigation.getParam('memeId', null),
      comments: [],
      commentCount: 0,
      commentsLoaded: 0,
      newestDoc: null,
      height: 0,
      modalVisible: false,
      tryingToTag: false,
      text: '',
      searchResults: [],
      searchTerm: '',
      peopleToTag: [],
      usernamesTagged: [],
      mostRecentAt: -1,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .doc(`Users/${firebase.auth().currentUser.uid}`)
      .get()
      .then((doc) => {
        this.setState(doc.data());
      });
    firebase
      .firestore()
      .doc(`CommentsTest/${this.state.memeId}/Info/CommentInfo`)
      .get()
      .then((doc) => this.setState({ commentCount: doc.data().count }));
    firebase
      .firestore()
      .collection(`CommentsTest/${this.state.memeId}/Text`)
      .orderBy('time', 'desc')
      .limit(5)
      .get()
      .then(this.updateComments);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  /**
   * Extract data from firebase QuerySnapshot to this.state.comments
   */
  updateComments = (commentsSnapshot) => {
    const newComments = commentsSnapshot.docs.map(async (doc) => {
      const { text, uid, time } = doc.data();
      return firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then((userDoc) => {
          if (!doc.exists) {
            console.log(`No such user ${uid} exist!`);
            return null;
          }
          const { username } = userDoc.data();
          return {
            key: doc.id,
            uid,
            userDoc, // DocumentSnapshot
            content: text,
            time,
            username,
          };
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
    });
    Promise.all(newComments).then((fulfilledComments) => {
      this.setState((prevState) => {
        const mergedComments = [
          ...fulfilledComments.reverse(),
          ...prevState.comments,
        ];
        return {
          comments: mergedComments,
          commentsLoaded: mergedComments.length,
          newestDoc: commentsSnapshot.docs[commentsSnapshot.docs.length - 1],
        };
      });
    });
  };

  /**
   * Fetch the next latest comments based on the oldest comment
   * already fetched
   */
  fetchComments = () => {
    const newestDoc = this.state.newestDoc;
    if (newestDoc) {
      firebase
        .firestore()
        .collection(`CommentsTest/${this.state.memeId}/Text`)
        .orderBy('time', 'desc')
        .limit(5)
        .startAfter(newestDoc)
        .get()
        .then(this.updateComments);
    }
  };

  _onPressButton = () => {
    // send notification
    this.sendTagNotifications();
    const user = firebase.auth().currentUser;
    const date = Math.round(+new Date() / 1000);
    const memeId = this.state.memeId;

    const countRef = firebase
      .firestore()
      .collection(`CommentsTest/${memeId}/Info`)
      .doc('CommentInfo');
    countRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          countRef.set(
            {
              count: 1,
            },
            { merge: true }
          );
        } else {
          const { count } = doc.data();
          countRef.set(
            {
              count: count + 1,
            },
            { merge: true }
          );
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });

    // Add this comment to the proper folder
    firebase
      .firestore()
      .collection(`CommentsTest/${memeId}/Text`)
      .add({
        uid: user.uid,
        text: this.state.text.trim(),
        time: date,
      })
      .then((newCommentDoc) => {
        this.setState((prevState) => {
          return {
            comments: [
              ...prevState.comments,
              {
                key: newCommentDoc.id,
                uid: firebase.auth().currentUser.uid,
                content: prevState.text.trim(),
                time: date,
                username: prevState.username,
              },
            ],
            commentsLoaded: prevState.commentsLoaded + 1,
            commentCount: prevState.commentCount + 1,
            text: '',
          };
        });
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
    Keyboard.dismiss();
  };

  /**
   * Pulls all users whose username starts with the searchTerm
   */
  updateSearch = async (searchTerm = '') => {
    // Set search term state immediately to update SearchBar contents
    this.setState({ searchTerm });

    const usersRef = firebase.firestore().collection('Users');
    const lowerSearchTerm = searchTerm.toLowerCase();
    let usernameMatches = [];
    let nameMatches = [];

    if (!searchTerm) {
      this.setState({ searchResults: [] });
      return;
    }

    usernameMatches = await usersRef
      .where('searchableUsername', '>=', lowerSearchTerm)
      .where('searchableUsername', '<', `${lowerSearchTerm}\uf8ff`)
      .get()
      .then((snapshot) => snapshot.docs)
      .catch((err) => console.log(err));

    nameMatches = await usersRef
      .where('searchableName', '>=', lowerSearchTerm)
      .where('searchableName', '<', `${lowerSearchTerm}\uf8ff`)
      .get()
      .then((snapshot) => snapshot.docs)
      .catch((err) => console.log(err));

    // Ensure there are no duplicates
    const combined = new Set(usernameMatches, nameMatches);
    this.setState({ searchResults: Array.from(combined).sort() });
  };

  renderSearchResult = (userRef) => {
    const data = userRef.item.data();
    const uid = userRef.item.ref.id;
    return <AtResult data={data} uid={uid} onSelect={this.tagPerson} />;
  };

  tagPerson = (username, uid) => {
    // if we already know to give this person a notifciation we can skip
    console.log(typeof this.state.usernamesTagged);
    console.log(this.state.usernamesTagged);
    if (this.state.usernamesTagged.indexOf(username) > -1) {
      this.setModalVisible(!this.state.modalVisible);
      const newText =
        this.state.text.substring(0, this.state.mostRecentAt + 1) + username;
      this.setState({
        text: newText,
        searchTerm: '',
        searchResults: [],
        tryingToTag: false,
      });
      return;
    }

    const newText =
      this.state.text.substring(0, this.state.mostRecentAt + 1) +
      username +
      ' ';
    this.state.peopleToTag.push(uid);
    this.state.usernamesTagged.push(username);
    this.setState({
      text: newText,
      searchTerm: '',
      searchResults: [],
      tryingToTag: false,
    });
    this.setModalVisible(!this.state.modalVisible);
    console.log(this.state.peopleToTag);
    console.log(this.state.usernamesTagged);
  };

  sendTagNotifications = () => {
    this.state.usernamesTagged.forEach((username, i) => {
      // verfiy that we are still tagging the people added to the list
      if (this.state.text.indexOf(username) > -1) {
        console.log('tagging ', username);
        // send notification to this.state.peopleToTag[i])
        const uid = firebase.auth().currentUser.uid;
        const time = Math.round(+new Date() / 1000);
        const memeId = this.state.memeId;
        const viewed = false;
        firebase
          .firestore()
          .collection('NotificationsTest')
          .doc(this.state.peopleToTag[i])
          .collection('Notes')
          .add({
            type: 'tag',
            uid,
            time,
            memeId,
            viewed,
          });
      }
    }, this);
  };

  render() {
    const sub = this.props.navigation.getParam('sub', '');
    const likedFrom = this.props.navigation.getParam('likedFrom', '');
    const postedBy = this.props.navigation.getParam('postedBy', '');
    const poster = this.props.navigation.getParam('poster', '');
    const caption = this.props.navigation.getParam('caption', '');

    return (
      <View>
        {this.state.modalVisible && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? null : 'position'}
            keyboardVerticalOffset={Dimensions.get('window').height * 0.1}
          >
            <ScrollView
              keyboardShouldPersistTaps='handled'
              ref={(ref) => {
                this.scrollView = ref;
              }}
              style={{ height: '100%' }}
            >
              <FlatList
                data={this.state.searchResults}
                keyboardShouldPersistTaps='always'
                renderItem={(userRef) => this.renderSearchResult(userRef)}
                style={{ height: '100%' }}
                keyExtractor={(item) => item.ref.id}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? null : 'position'}
          keyboardVerticalOffset={Dimensions.get('window').height * 0.1}
        >
          {!this.state.modalVisible && (
            <ScrollView
              ref={(ref) => {
                this.scrollView = ref;
              }}
              style={{ height: '100%' }}
            >
              <View style={{ paddingBottom: '15%' }}>
                <Tile
                  memeId={this.state.memeId}
                  imageUrl={this.state.imageuri}
                  sub={sub}
                  likedFrom={likedFrom}
                  postedBy={postedBy}
                  poster={poster}
                  showAllComments={this.showAllComments}
                  isSubRedditPg={this.props.navigation.getParam(
                    'isSubRedditPg'
                  )}
                  caption={caption}
                />
                <CommentList
                  memeId={this.state.memeId}
                  comments={this.state.comments}
                  fetchComments={this.fetchComments}
                  commentsLoaded={this.state.commentsLoaded}
                  commentCount={this.state.commentCount}
                />
              </View>
            </ScrollView>
          )}

          {/* please forgive me this is the add comment button stuff all right here */}
          <View
            style={[
              styles.container,
              { height: Math.max(35, this.state.height) + 10 },
            ]}
          >
            <TextInput
              {...this.props}
              multiline
              placeholder='Add a comment...'
              autoCapitalize='none'
              onChangeText={(text) => {
                // have a bool called if trying to tag
                if (this.state.tryingToTag) {
                  if (text.length - 1 < this.state.mostRecentAt) {
                    this.state.tryingToTag = false;
                    this.setModalVisible(!this.state.modalVisible);
                  } else {
                    this.setModalVisible(true);
                  }
                  this.state.searchTerm = text.substring(
                    this.state.mostRecentAt + 1,
                    text.length
                  );
                  this.updateSearch(this.state.searchTerm);
                }

                if (text[text.length - 1] === '@') {
                  this.setState({
                    mostRecentAt: text.length - 1,
                    tryingToTag: true,
                  });
                }

                this.setState({ text });
              }}
              onContentSizeChange={(event) => {
                this.setState({
                  height: Math.min(120, event.nativeEvent.contentSize.height),
                });
              }}
              style={[
                styles.input,
                { height: Math.max(35, this.state.height) },
              ]}
              value={this.state.text}
            />

            <Button
              onPress={this._onPressButton}
              style={[
                styles.postButton,
                { height: Math.max(35, this.state.height) },
              ]}
              disabled={!this.state.text.trim()}
              title='Post'
              color='#000'
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default CommentPage;

const styles = StyleSheet.create({
  containerA: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
  },
  input: {
    width: '80%',
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginLeft: '3%',
    fontSize: 18,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
});
