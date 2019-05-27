import React from 'react';
import { FlatList, StyleSheet, View, Button, TextInput, Keyboard, Modal, Text, TouchableHighlight } from 'react-native';
import firebase from 'react-native-firebase';
import AtResult from './atResult';

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this._onPressButton = this._onPressButton.bind(this);
    this.tagPerson = this.tagPerson.bind(this)
    this.state = {
      height: 0,
      modalVisible: false,
      text: '',
      searchResults: [],
      searchTerm: '',
      peopleToTag: [],
      usernamesTagged: [],
      mostRecentAt: -1,
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }


  _onPressButton = () => {
    const user = firebase.auth().currentUser;
    const date = Math.round(+new Date() / 1000);
    const memeId = this.props.memeId;

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

    const ref = firebase.firestore().collection(`CommentsTest/${memeId}/Text`);

    ref
      .get()
      .then((doc) => {
        if (!doc.exists) {
          // Add necessary infrastruction
          firebase
            .firestore()
            .collection('CommentsTest')
            .doc(memeId);
          firebase
            .firestore()
            .collection('CommentsTest')
            .doc(memeId)
            .collection('Text');
        }

        // Add this comment to the proper folder
        firebase
          .firestore()
          .collection(`CommentsTest/${memeId}/Text`)
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
            this.props.handleNewComment(commentRef);
            console.log('Added document with ID: ', commentRef.id);
          });
        console.log('Document data:', doc.data());
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
            if (followersLst.includes(snapshot.ref.id)) {
              if (!map.has(snapshot.ref.id) && myUid !== snapshot.ref.id) {
                map.set(snapshot.ref.id);
                searchResults.push(snapshot);
              }
            }
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
        searchResults: []
      });
      return
    }

    const newText = this.state.text.substring(0,this.state.mostRecentAt+1)+username
    this.state.peopleToTag.push(uid)
    this.state.usernamesTagged.push(username)
    this.setState({
      text: newText,
      searchTerm: '',
      searchResults: []
    });
    this.setModalVisible(!this.state.modalVisible);
    console.log(this.state.peopleToTag)
    console.log(this.state.usernamesTagged)
  }

  sendTagNotifications = () => {
    for (var i = 0; i < this.state.usersTagging.length; i++) {
      username = this.state.usersTagging[i]
      // verfiy that we are still tagging the people added to the list
      if ((this.state.text).indexOf(username) > -1) {
        console.log('tagging ',username)
        // send notification to this.state.peopleToTag[i])
      }
    }
  }

  render() {
    if (this.state.modalVisible) {
      return (
        <View>
        <Modal
          animationType="slide"
          transparent={false}
          presentationStyle="pageSheet"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22}}>
            <View>
              <Text>Hello World!</Text>

              <TextInput
                {...this.props}
                multiline
                autoCapitalize='none'
                onChangeText={(text) => {
                  console.log(text)
                  if (text.length-1 < this.state.mostRecentAt){
                    this.setModalVisible(!this.state.modalVisible);
                  }
                  this.state.searchTerm = text.substring(this.state.mostRecentAt+1, text.length);
                  this.updateSearch(this.state.searchTerm)
                  this.setState({ text })
                }}
                onContentSizeChange={(event) => {
                  this.setState({
                    height: Math.min(120, event.nativeEvent.contentSize.height),
                  });
                }}
                style={[styles.input, { height: Math.max(35, this.state.height) }]}
                value={this.state.text}
              />

              <FlatList
                data={this.state.searchResults}
                renderItem={(userRef) => this.renderSearchResult(userRef)}
                keyExtractor={(item) => item.ref.id}
              />


              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        </View>
      )
    } else {
    return (
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
            if (text[text.length-1] === '@') {
              this.setModalVisible(true);
              this.setState({mostRecentAt: text.length-1})
            }
            this.state.searchTerm = 'f'
            this.setState({text})
            console.log(typeof(this.state.usernamesTagged))
          }}
          onContentSizeChange={(event) => {
            this.setState({
              height: Math.min(120, event.nativeEvent.contentSize.height),
            });
          }}
          style={[styles.input, { height: Math.max(35, this.state.height) }]}
          value={this.state.text}
        />

        <TouchableOpacity onPress={this._onPressButton}
            style={{backgroundColor: 'transparent',
                fontFamily: 'AvenirNext-Regular',
                textAlign: 'center',
                fontSize: 20,
                color: 'black',
                marginBottom: 3,
                height: Math.max(35, this.state.height),
                justifyContent: 'center',
                marginLeft: 10,
                marginTop: 3}}

            disabled={!this.state.text.trim()} >
            <Text style={styles.button}>Post </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
}

export default AddComment;

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: 'transparent',
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    marginBottom: 3,
    height: 35,
    justifyContent: 'center'
    //height: Math.max(35, this.state.height),
  }
});
