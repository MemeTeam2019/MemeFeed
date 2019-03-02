import * as React from 'react';
import firebase from 'react-native-firebase';
import {SearchBar} from 'react-native-elements';
import Grid from 'react-native-grid-component';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  FlatList
} from 'react-native';


import Tile from '../components/image/Tile'

class HomeFeed extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super(); 
    this.ref = firebase.firestore().collection('Memes').orderBy('time', "desc");
    this.unsubscribe = null;
    this.state = {
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

  componentDidMount() {
    
    console.log(this.state.memesLoaded)
    this.unsubscribe = this.ref.limit(this.state.memesLoaded).onSnapshot(this.onCollectionUpdate);
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

  _renderItem = (data, i) => (
    <View style={[styles.item]} key={i}>
      <TouchableOpacity
        style={{
          flex: 1,
        }}
        onPress={() => {
          this.ShowModalFunction(true, data.src);
        }}>
        <Image
          style={{ flex: 1 }}
          source={{
            uri:
              data.src,
          }}
        />
      </TouchableOpacity>
    </View>
  );

  renderTile(){
    return <Tile/>;
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
            {/* List View */}
            <FlatList
              data={this.state.memes}
              renderItem={this.renderTile.bind(this)}
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
          <Grid
            style={styles.list}
            renderItem={this._renderItem}
            renderPlaceholder={this._renderPlaceholder}
            data={this.state.memes}
            itemsPerRow={3}
            onEndReached={() => {
              newLoadCount = this.state.memesLoaded + 60;
              this.setState({
                memesLoaded: newLoadCount,
              });
              this.componentDidMount();
            }}
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