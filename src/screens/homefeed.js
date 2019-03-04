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

import Tile from '../components/image/Tile'

import Grid from 'react-native-grid-component';

class HomeFeed extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props); 
    this.ref = firebase.firestore().collection('Memes').orderBy('time', 'desc');
    this.unsubscribe = null;
    this.state = {
      memesLoaded: 30,
      imageuri: '',
      ModalVisibleStatus: false,
      isLoading: true,
      inGridView: true,
      inFullView: false,
      memes: [],
      items: [],
      selectGridButton: true,
      selectListButton: false,
      search: '',
    };
  }


  updateSearch = search => {
    this.setState({ search });
  };

  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const memes = [];
    querySnapshot.forEach((doc) => {
      const { url, time} = doc.data();
      memes.push({
        key: doc.id,
        doc, // DocumentSnapshot
        src: url,
        time,
      });
    });
    this.setState({
      memes,
      isLoading: false,
   });
  }


  componentDidMount(memesLoaded) {
    console.log('loading memes rn')
    this.unsubscribe = this.ref.limit(memesLoaded).onSnapshot(this.onCollectionUpdate);
    return this.state.memes
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


  render() {
    const { search } = this.state;
    if (this.state.ModalVisibleStatus) {
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
              value={search}
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
            placeholder="Explore"
            onChangeText={this.updateSearch}
            value={search}
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