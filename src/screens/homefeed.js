import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import firebase from 'react-native-firebase';

import { SearchResult } from '../components/home/SearchResults';
import MemeGrid from '../components/general/MemeGrid';
import MemeList from '../components/general/MemeList';

class HomeFeed extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this._isMounted = false;
    this.state = {
      memesLoaded: 30,
      imageuri: '',
      ModalVisibleStatus: false,
      isLoading: true,
      inGridView: true,
      inFullView: false,
      memes: [],
      items: [],
      allUsers: [],
      searchResults: [],
      selectGridButton: true,
      selectListButton: false,
      searchTerm: '',
    };
  }

  componentDidMount(memesLoaded) {
    this._isMounted = true;
    if (this._isMounted){
      this.ref = firebase.firestore().collection('Memes').orderBy('time', 'desc');
      this.unsubscribe = this.ref.limit(memesLoaded).onSnapshot(this.onCollectionUpdate);
    }
  }

  /**
   * Pulls all users whose username starts with the searchTerm
   *
   * TODO: also filter by name
   */
  updateSearch = async (searchTerm = '') => {
    // Set search term state immediately to update SearchBar contents
    this.setState({ searchTerm: searchTerm });

    const usersRef = firebase.firestore().collection('Users');
    const lowerSearchTerm = searchTerm.toLowerCase();
    let usernameMatches = [],
      nameMatches = [];

    if (!searchTerm) {
      this.setState({ searchResults: [] });
      return;
    }

    usernameMatches = await usersRef
      .where('searchableUsername', '>=', lowerSearchTerm)
      .where('searchableUsername', '<', lowerSearchTerm + '\uf8ff')  
      .get()
      .then(snapshot => snapshot.docs)
      .catch(err => console.log(err));

    nameMatches = await usersRef
      .where('searchableName', '>=', lowerSearchTerm)
      .where('searchableName', '<', lowerSearchTerm + '\uf8ff')
      .get()
      .then(snapshot => snapshot.docs)
      .catch(err => console.log(err));

    // Ensure there are no duplicates and your own profile doesn't show up
    const combined = [...usernameMatches, ...nameMatches];
    const searchResults = [];
    const map = new Map();
    const myUid = firebase.auth().currentUser.uid;
    combined.forEach(snapshot => {
      if (!map.has(snapshot.ref.id) && myUid !== snapshot.ref.id) {
        map.set(snapshot.ref.id);
        searchResults.push(snapshot);
      }
    });
    this.setState({ searchResults: searchResults });
  };

  // function for extracting Firebase responses to the state
  onCollectionUpdate = querySnapshot => {
    const memes = [];
    querySnapshot.forEach((doc) => {
      const { url, time, sub } = doc.data();
      memes.push({
        key: doc.id,
        doc, // DocumentSnapshot
        src: url,
        time,
        sub,
        postedBy: sub,
      });
    });
    this.setState({
      memes,
      isLoading: false,
    });
  };

  ShowModalFunction(visible, imageURL) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  }

  showGridView = () => {
    //when grid button is pressed, show grid view
    this.setState({
      inGridView: true,
      inFullView: false,
    });
  };

  showFullView = () => {
    //when full button is bressed, show full view
    this.setState({
      inFullView: true,
      inGridView: false,
    });
  };

  renderSearchResult = userRef => {
    const data = userRef.item.data();
    const uid = userRef.item.ref.id;
    return <SearchResult data={data} uid={uid} />;
  };

  componentToRender = () => {
    if (this.state.searchTerm) {
      return (
        <FlatList
          data={this.state.searchResults}
          renderItem={userRef => this.renderSearchResult(userRef)}
          keyExtractor={item => item.ref.id}
        />
      );
    } else if (this.state.inFullView) {
      return (
        <MemeList loadMemes={this.componentDidMount} memes={this.state.memes} />
      );
    } else {
      return (
        <MemeGrid
          loadMemes={this.componentDidMount}
          memes={this.state.memes}
        />
      );
    }
  };

  render() {
    const searchTerm = this.state.searchTerm;

    if (this.state.ModalVisibleStatus) {
      //Modal to show full image with close button
      return (
        <Modal
          transparent={false}
          animationType={'fade'}
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
    } else {
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <SearchBar
              placeholder={'Find User'}
              onChangeText={query => this.updateSearch(query)}
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
              platform={'ios'}
              cancelButtonTitle={'Cancel'}
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
          {this.componentToRender()}
        </View>
      );
    }
  }
}

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
    paddingTop: 50, //50
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

export default HomeFeed;
