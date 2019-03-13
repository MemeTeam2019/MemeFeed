import * as React from 'react';
import firebase from 'react-native-firebase';
import { SearchBar } from 'react-native-elements';
import MemeGrid from '../components/general/MemeGrid';
import MemeList from '../components/general/MemeList';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  FlatList
} from 'react-native';

import { SearchResult } from '../components/home/SearchResults';

class HomeFeed extends React.Component {
  static navigationOptions = {
    header: null
  }
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
      searchTerm: ''
    };
  }

  componentDidMount (memesLoaded) {
    this._isMounted = true;
    if (this._isMounted) {
      this.ref = firebase.firestore().collection('Memes').orderBy('time', 'desc');
      this.unsubscribe = this.ref.limit(memesLoaded).onSnapshot(this.onCollectionUpdate);
      this.getAllUsers();
      this.setState({ myUid: firebase.auth().currentUser.uid })
      return this.state.memes;
    }
  }

  updateSearch = (searchTerm) => {
    let results = this.state.allUsers.filter(doc => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const username = doc.data().username.toLowerCase();
      const name = doc.data().name.toLowerCase();
      return (username.startsWith(lowerSearchTerm)
              || name.startsWith(lowerSearchTerm))
              && doc.ref.id !== this.state.myUid;
    });
    console.log(results);
    if (!searchTerm)
      results = [];
    this.setState({
      searchResults: results,
      searchTerm: searchTerm
    });
  }

  getAllUsers = () => {
    firebase.firestore().collection("Users").get().then(snapshot => {
      this.setState({ allUsers: snapshot.docs });
    });
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
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
  }

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
      inFullView: false
    })
  }

  showFullView = () => {
    //when full button is bressed, show full view
    this.setState({
      inFullView: true,
      inGridView: false
    })
  }


  renderSearchResult = (userRef) => {
    const data = userRef.item.data();
    const uid = userRef.item.ref.id;
    return <SearchResult data={data} uid={uid}/>;
  }

  render() {
    const searchTerm = this.state.searchTerm;
    if (this.state.searchTerm) {
      return (
        <View style={styles.containerStyle}>
        <View style={styles.navBar}>
        <SearchBar
          placeholder="Find User"
          onChangeText={this.updateSearch}
          value={searchTerm}
          containerStyle={{
                          backgroundColor: 'transparent',
                          borderTopWidth: 0,
                          borderBottomWidth: 0,
                      }}
          inputStyle={{
                          backgroundColor: 'lightgrey',
                          color: 'black'
                      }}
          onClear={() => {

          }}
          onCancel={() => {
            this.setState({ searchTerm: "" })
          }}
          platform="ios"
          cancelButtonTitle="Cancel"
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
    else if (this.state.ModalVisibleStatus) {
      //Modal to show full image with close button
      return (
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus,'');
          }}>
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
                this.ShowModalFunction(!this.state.ModalVisibleStatus,'');
              }}>
              <Image
                source={{
                  uri:
                    'https://aboutreact.com/wp-content/uploads/2018/09/close.png',
                }}
                style={{ width: 25, height: 25, marginTop:16 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      );
    } else if (this.state.inFullView) {
      //Photo List/Full View of images
        return(
          <View style={styles.containerStyle}>
            <View style={styles.navBar}>
            <SearchBar
              placeholder="Find User"
              onChangeText={this.updateSearch}
              value={searchTerm}
              containerStyle={{
                              backgroundColor: 'transparent',
                              borderTopWidth: 0,
                              borderBottomWidth: 0,
                          }}
              inputStyle={{
                              backgroundColor: 'lightgrey',
                              color: 'black'
                          }}
              onClear={() => {

              }}
              onCancel={() => {
                this.setState({ searchTerm: "" })
              }}
              platform="ios"
              cancelButtonTitle="Cancel"
            />
            </View>
            <View style={styles.navBut}>
              <TouchableOpacity onPress={() => this.showFullView()}>
                <Image
                source={require('../images/fullFeedF.png')} style={{ opacity:  this.state.inFullView
                                                                      ? 1 : 0.3,
                                                                    width: 100, height: 50}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.showGridView()}>
                <Image
                source={require('../images/gridFeedF.png')} style={{ opacity:  this.state.inGridView
                                                                      ? 1 : 0.3,
                                                                    width: 100, height: 50}}
                />
              </TouchableOpacity>
            </View>
            {/* List View */}
            <MemeList
              loadMemes={this.componentDidMount}
              memes={this.state.memes}
            />
          </View>
        );
    } else {
      //Photo Grid of images
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
          <SearchBar
            placeholder="Search User"
            onChangeText={this.updateSearch}
            value={searchTerm}
            containerStyle={{
                            backgroundColor: 'transparent',
                            borderTopWidth: 0,
                            borderBottomWidth: 0,
                        }}
            inputStyle={{
                            backgroundColor: 'lightgrey',
                            color: 'black'
                        }}
            onClear={() => {

            }}
            onCancel={() => {

            }}
            platform="ios"
            cancelButtonTitle="Cancel"
          />
          </View>
          <View style={styles.navBut}>
            <TouchableOpacity onPress={() => this.showFullView()}>
              <Image
              source={require('../images/fullFeedF.png')} style={{ opacity:  this.state.inFullView
                                                                    ? 1 : 0.3,
                                                                  width: 100, height: 50}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showGridView()}>
              <Image
              source={require('../images/gridFeedF.png')} style={{ opacity:  this.state.inGridView
                                                                    ? 1 : 0.3,
                                                                  width: 100, height: 50}}
              />
            </TouchableOpacity>
          </View>

          <MemeGrid
            loadMemes={this.componentDidMount}
            memes={this.state.memes}
          />
        </View>
      );
  }
}}

export default HomeFeed;

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
    height:95,
    elevation: 3,
    paddingHorizontal: 20,
    paddingTop: 50,//50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  navBut: {
    height:50,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
