import * as React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import firebase from 'react-native-firebase';
import { SearchBar } from 'react-native-elements';

import MemeGrid from '../components/general/memeGrid';
import MemeList from '../components/general/memeList';
import SearchResult from '../components/home/searchResult';

/**
 * Feed of novel memes in Firebase, which are pulled from various subreddits.
 * Can also search for users on this screen
 *
 * Used by:
 *     mainNavigator.js
 *
 * Props:
 *     None
 */
class ExploreFeed extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.unsubscribe = null;
    this.state = {
      updated: true,
      imageuri: '',
      ModalVisibleStatus: false,
      inGridView: true,
      inFullView: false,
      memes: [],
      searchResults: [],
      searchTerm: '',
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe = null;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.unsubscribe = firebase
        .firestore()
        .collection('Memes')
        .orderBy('time', 'desc')
        .limit(15)
        .get()
        .then(this.updateFeed);
    }
  }

  fetchMemes = () => {
    // garentees not uploading duplicate memes by checking if memes have finished
    // updating
    if (this.state.updated) {
      this.state.updated = false;
      const oldestDoc = this.state.oldestDoc;
      firebase
        .firestore()
        .collection('Memes')
        .orderBy('time', 'desc')
        .limit(15)
        .startAfter(oldestDoc)
        .get()
        .then(this.updateFeed);
    }
  };

  updateFeed = (querySnapshot) => {
    const newMemes = [];
    querySnapshot.docs.forEach((doc) => {
      const { url, time, sub } = doc.data();
      newMemes.push({
        key: doc.id,
        doc,
        src: url,
        time,
        sub,
        postedBy: sub,
      });
    });

    Promise.all(newMemes).then((resolvedMemes) => {
      this.setState((prevState) => {
        const mergedMemes = prevState.memes.concat(resolvedMemes);
        return {
          memes: mergedMemes,
          updated: true,
          oldestDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        };
      });
    });
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

  // When grid button is pressed, show grid view
  showGridView = () => {
    this.setState({
      inGridView: true,
      inFullView: false,
    });
  };

  showFullView = () => {
    this.setState({
      inFullView: true,
      inGridView: false,
    });
  };

  ShowModalFunction = (visible, imageURL) => {
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  };

  renderSearchResult = (userRef) => {
    console.log(userRef.item);
    const data = userRef.item.data();
    const uid = userRef.item.ref.id;
    return <SearchResult data={data} uid={uid} />;
  };

  render() {
    const searchTerm = this.state.searchTerm;
    if (this.state.searchTerm) {
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <SearchBar
              placeholder='Find User'
              onChangeText={this.updateSearch}
              value={searchTerm}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                borderBottomWidth: 0,
              }}
              inputStyle={{
                backgroundColor: 'lightgrey',
                color: 'black',
              }}
              onClear={() => {}}
              onCancel={() => {
                this.setState({ searchTerm: '' });
              }}
              platform='ios'
              cancelButtonTitle='Cancel'
            />
          </View>

          {/* List View */}
          <FlatList
            data={this.state.searchResults}
            renderItem={(userRef) => this.renderSearchResult(userRef)}
            keyExtractor={(item) => item.ref.id}
          />
        </View>
      );
    }
    if (this.state.ModalVisibleStatus) {
      return (
        <Modal
          transparent={false}
          animationType='fade'
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
          }}
        >
          <View style={styles.modelStyle}>
            {/* Single Image - Tile */}
            <Image
              style={styles.fullImageStyle}
              source={{ uri: this.state.imageuri }}
            />
            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.closeButtonStyle}
              onPress={() => {
                this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
              }}
            >
              <Image
                source={{
                  uri:
                    'https://aboutreact.com/wp-content/uploads/2018/09/close.png',
                }}
                style={{ width: 25, height: 25, marginTop: 16 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      );
    }
    if (this.state.inFullView) {
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <SearchBar
              placeholder='Find User'
              onChangeText={this.updateSearch}
              value={searchTerm}
              containerStyle={{
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                borderBottomWidth: 0,
              }}
              inputStyle={{
                backgroundColor: 'lightgrey',
                color: 'black',
              }}
              onClear={() => {}}
              onCancel={() => {
                this.setState({ searchTerm: '' });
              }}
              platform='ios'
              cancelButtonTitle='Cancel'
            />
          </View>
          <View style={styles.navBut}>
            <TouchableOpacity onPress={() => this.showFullView()}>
              <Image
                source={require('../images/fullFeedF.png')}
                style={{
                  opacity: this.state.inFullView ? 1 : 0.3,
                  width: 100,
                  height: 50,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showGridView()}>
              <Image
                source={require('../images/gridFeedF.png')}
                style={{
                  opacity: this.state.inGridView ? 1 : 0.3,
                  width: 100,
                  height: 50,
                }}
              />
            </TouchableOpacity>
          </View>
          {/* List View */}
          <MemeList loadMemes={this.fetchMemes} memes={this.state.memes} />
        </View>
      );
    }
    return (
      <View style={styles.containerStyle}>
        <View style={styles.navBar}>
          <SearchBar
            placeholder='Search User'
            onChangeText={this.updateSearch}
            value={searchTerm}
            containerStyle={{
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            }}
            inputStyle={{
              backgroundColor: 'lightgrey',
              color: 'black',
            }}
            onClear={() => {}}
            onCancel={() => {}}
            platform='ios'
            cancelButtonTitle='Cancel'
          />
        </View>
        <View style={styles.navBut}>
          <TouchableOpacity onPress={() => this.showFullView()}>
            <Image
              source={require('../images/fullFeedF.png')}
              style={{
                opacity: this.state.inFullView ? 1 : 0.3,
                width: 100,
                height: 50,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.showGridView()}>
            <Image
              source={require('../images/gridFeedF.png')}
              style={{
                opacity: this.state.inGridView ? 1 : 0.3,
                width: 100,
                height: 50,
              }}
            />
          </TouchableOpacity>
        </View>

        <MemeGrid loadMemes={this.fetchMemes} memes={this.state.memes} />
      </View>
    );
  }
}

export default ExploreFeed;

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 9,
    position: 'absolute',
  },
  navBar: {
    height: 95,
    elevation: 3,
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  navBut: {
    height: 50,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
