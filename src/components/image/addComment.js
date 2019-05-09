import React from 'react';
import { FlatList, StyleSheet, View, Button, TextInput, Keyboard, Modal, Text, TouchableHighlight } from 'react-native';
import firebase from 'react-native-firebase';
import SearchResult from '../home/searchResult';

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this._onPressButton = this._onPressButton.bind(this);
    this.state = {
      height: 0,
      modalVisible: false,
      text: '',
      searchResults: [],
      searchTerm: '',
      mostRecentAt: -1
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

    const usersRef = firebase.firestore().collection('Users');
    const lowerSearchTerm = searchTerm.toLowerCase();
    let usernameMatches = [];
    let nameMatches = [];

    if (!searchTerm) {
      this.setState({ searchResults: [] });
      console.log('oof')
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
    const myUid = firebase.auth().currentUser.uid;
    combined.forEach((snapshot) => {
      if (!map.has(snapshot.ref.id) && myUid !== snapshot.ref.id) {
        map.set(snapshot.ref.id);
        searchResults.push(snapshot);
      }
    });
    this.setState({ searchResults: searchResults.sort() });
  };

  renderSearchResult = (userRef) => {
    const data = userRef.item.data();
    const uid = userRef.item.ref.id;
    return <SearchResult data={data} uid={uid} />;
  };

  render() {
    return (
      <View>
      <Modal
        animationType="slide"
        transparent={false}
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
            }
            this.state.searchTerm = 'f'
            this.setState({ text, mostRecentAt: text.length-1})
          }}
          onContentSizeChange={(event) => {
            this.setState({
              height: Math.min(120, event.nativeEvent.contentSize.height),
            });
          }}
          style={[styles.input, { height: Math.max(35, this.state.height) }]}
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
      </View>
    );
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
});
