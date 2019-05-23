import React from 'react';
import { ScrollView, KeyboardAvoidingView, Dimensions,
FlatList, StyleSheet, View, Button, TextInput, Keyboard, Modal, Text, TouchableHighlight, Platform } from 'react-native';
import firebase from 'react-native-firebase';

import Tile from '../components/image/tile';
// import AddComment from '../components/image/addComment';
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
    this.handleNewComment = this.handleNewComment.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
    this.tagPerson = this.tagPerson.bind(this)
    this.state = {
      imageuri: this.props.navigation.getParam('uri', null),
      memeId: this.props.navigation.getParam('memeId', null),
      comments: [],
      commentCount: 0,
      commentsLoaded: 0,
      oldestDoc: null,
      height: 0,
      modalVisible: false,
      tryingToTag: false,
      text: '',
      searchResults: [],
      searchTerm: '',
      peopleToTag: [],
      usernamesTagged: [],
      mostRecentAt: -1
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
        //console.log('Error getting document', err);
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
      //console.log(text, uid, time);
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
            //console.log(error);
          })
      );
    });
    Promise.all(newComments).then((resolvedComments) => {
      resolvedComments.reverse();
      this.setState((prevState) => {
        const mergedComments = resolvedComments.concat(prevState.comments);
        //console.log(mergedComments);
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
      //console.log(text, uid, time);
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
          //console.log(newComment);
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


  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }



  _onPressButton = () => {
    // send notification
    this.sendTagNotifications()
      const user = firebase.auth().currentUser;
      const date = Math.round(+new Date() / 1000);
      const memeId = this.state.memeId;

      const countRef = firebase
        .firestore()
        .collection(`Comments/${memeId}/Info`)
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

      const ref = firebase.firestore().collection(`Comments/${memeId}/Text`);

      ref
        .get()
        .then((doc) => {
          if (!doc.exists) {
            // Add necessary infrastruction
            firebase
              .firestore()
              .collection('Comments')
              .doc(memeId);
            firebase
              .firestore()
              .collection('Comments')
              .doc(memeId)
              .collection('Text');
          }

          // Add this comment to the proper folder
          firebase
            .firestore()
            .collection(`Comments/${memeId}/Text`)
            .add({
              uid: user.uid,
              text: this.state.text.trim(),
              time: date,
            })
            .then((commentRef) => {
              this.setState({
                text: '',
              });
              console.log(this.props);
              this.handleNewComment(commentRef);
              console.log('Added document with ID: ', commentRef.id);
            });
          console.log('Document data:', doc.data());
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
      this.setModalVisible(false);
      Keyboard.dismiss();
    };


    /**
     * Pulls all users whose username starts with the searchTerm
     */
    updateSearch = async (searchTerm = '') => {
      console.log('updating search')
      console.log(searchTerm)
      // Set search term state immediately to update SearchBar contents
      this.setState({ searchTerm });
      const myUid = firebase.auth().currentUser.uid;


      const countRef = firebase
        .firestore()
        .collection('Users')
        .doc(myUid)
        .get()
        .then(async (doc) => {
            const { followersLst } = doc.data();
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

            // Ensure there are no duplicates and your own profile doesn't show up
            const combined = [...usernameMatches, ...nameMatches];
            const searchResults = [];
            const map = new Map();
            combined.forEach((snapshot) => {
              // check if this person is following up
              //if (followersLst.includes(snapshot.ref.id)) {
                if (!map.has(snapshot.ref.id) && myUid !== snapshot.ref.id) {
                  map.set(snapshot.ref.id);
                  searchResults.push(snapshot);
                }
              //}
            });
            this.setState({ searchResults: searchResults.sort() });

        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
    };

    renderSearchResult = (userRef) => {
      const data = userRef.item.data();
      const uid = userRef.item.ref.id;
      return <AtResult data={data} uid={uid} onSelect={this.tagPerson}/>;
    };

    tagPerson = (username,uid) => {
      // if we already know to give this person a notifciation we can skip
      console.log(typeof(this.state.usernamesTagged))
      console.log(this.state.usernamesTagged)
      if (this.state.usernamesTagged.indexOf(username) > -1) {
        this.setModalVisible(!this.state.modalVisible);
        const newText = this.state.text.substring(0,this.state.mostRecentAt+1)+username
        this.setState({
          text: newText,
          searchTerm: '',
          searchResults: [],
          tryingToTag: false,
        });
        return
      }

      const newText = this.state.text.substring(0,this.state.mostRecentAt+1)+username+" "
      this.state.peopleToTag.push(uid)
      this.state.usernamesTagged.push(username)
      this.setState({
        text: newText,
        searchTerm: '',
        searchResults: [],
        tryingToTag: false,
      });
      this.setModalVisible(!this.state.modalVisible);
      console.log(this.state.peopleToTag)
      console.log(this.state.usernamesTagged)
    }



  sendTagNotifications = () => {
   for (var i = 0; i < this.state.peopleToTag.length; i++) {
     username = this.state.usernamesTagged[i];
     // verfiy that we are still tagging the people added to the list
     if ((this.state.text).indexOf(username) > -1) {
       console.log('tagging ',username);
       // send notification to this.state.peopleToTag[i])
           const uid = firebase.auth().currentUser.uid;
           const time = Math.round(+new Date() / 1000);
           const memeId = this.state.memeId;
           const viewed = false;
           const noteRef = firebase
             .firestore()
             .collection("Notifications")
             .doc(this.state.peopleToTag[i])
             .collection("Notes");
           noteRef.add({type: 'tag',
                         uid: uid,
                         time: time,
                         memeId: memeId,
                         viewed: viewed});

     }
   }
 }



      // for (var i = 0; i < this.state.usersTagging.length; i++) {
      //   username = this.state.usersTagging[i]
      //   // verfiy that we are still tagging the people added to the list
      //   if ((this.state.text).indexOf(username) > -1) {
      //     console.log('tagging ',username)
      //     // send notification to this.state.peopleToTag[i])
      //   }
      // }
    // }

  render() {
    const sub = this.props.navigation.getParam('sub', '');
    const likedFrom = this.props.navigation.getParam('likedFrom', '');
    const postedBy = this.props.navigation.getParam('postedBy', '');
    const poster = this.props.navigation.getParam('poster', '');

    return (
      <View>

      { this.state.modalVisible &&
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={Dimensions.get('window').height * 0.1 }
        >

        <ScrollView
          keyboardShouldPersistTaps="handled"
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
      }

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? null : 'position'}
        keyboardVerticalOffset={Dimensions.get('window').height * 0.1}
      >
      { !this.state.modalVisible &&
        <ScrollView
          ref={(ref) => {
            this.scrollView = ref;
          }}
          style={{ height: '100%' }}
        >
          <View>
            <Tile
              memeId={this.state.memeId}
              imageUrl={this.state.imageuri}
              sub={sub}
              likedFrom={likedFrom}
              postedBy={postedBy}
              poster={poster}
              showAllComments={this.showAllComments}
              isSubRedditPg={this.props.navigation.getParam('isSubRedditPg')}
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
        }
        {/* please forgive me this is the add comment button stuff all right here*/}
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
              if (this.state.tryingToTag){
                if (text.length-1 < this.state.mostRecentAt) {
                  this.state.tryingToTag = false
                  this.setModalVisible(!this.state.modalVisible);
                } else {
                  this.setModalVisible(true);
                }
                this.state.searchTerm = text.substring(this.state.mostRecentAt+1, text.length);
                this.updateSearch(this.state.searchTerm)
              }

              if (text[text.length-1] === '@') {
                this.setState({mostRecentAt: text.length-1, tryingToTag: true})
              }

              this.setState({text})
            }}
            onContentSizeChange={(event) => {
              this.setState({
                height: Math.min(120, event.nativeEvent.contentSize.height),
              });
            }}
            style={[styles.input, { height: Math.max(35, this.state.height) }]}
            value={this.state.text}/>

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
