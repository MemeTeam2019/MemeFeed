import * as React from 'react';
import firebase from 'react-native-firebase';

//import React in our project
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
  FlatList
} from 'react-native';

//import all the needed components
//tile component
import Tile from '../components/image/Tile'

import PhotoGrid from 'react-native-image-grid';

class FriendFeed extends React.Component{
  static navigationOptions = {
    header: null
  }
  constructor(){
    super();
    this.ref = firebase.firestore().collection('Memes').orderBy('time', "desc");
    this.unsubscribe = null;
    this.state = {
      imageuri: '',
      ModalVisibleStatus: false,
      isLoading: true,
      inGridView: false,
      inFullView: true,
      memes: [],
      items: [],
      selectGridButton: false,
      selectListButton: true,
    };
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const memes = [];
    querySnapshot.forEach((doc) => {
    const { url, time } = doc.data();
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

  ShowModalFunction(visible, imageURL, memeId) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
      memeId: memeId
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

  renderItem(item, itemSize, itemPaddingHorizontal) {
    //Single item of Grid
    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: itemSize,
          height: itemSize,
          paddingHorizontal: itemPaddingHorizontal,
        }}
        onPress={() => {
          this.ShowModalFunction(true, item.src, item.key);
        }}>
        <Image
          resizeMode="cover"
          style={{ flex: 1 }}
          source={{ uri: item.src }}
        />
      </TouchableOpacity>
    );
  }

  renderTile({item}){
    //for list view
    return <Tile
      memeId={item.key}
      imageUrl={item.src}/>
  }

  render(){
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
            <Tile
              memeId={this.state.memeId}
              imageUrl={this.state.imageuri}
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
      } else if(this.state.inGridView){
          return(
            <View style={styles.containerStyle}>
              <View style={styles.navBar}>
                <Image source={require('../images/banner3.png')} style={{ width: 250, height: 50}} />
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
              <PhotoGrid
                data={this.state.memes}
                itemsPerRow={3}
                //You can decide the item per row
                itemMargin={1}
                itemPaddingHorizontal={1}
                renderHeader={this.renderHeader}
                renderItem={this.renderItem.bind(this)}
              />
            </View>
          );
      } else{
          // in full view
          return(
            <View style={styles.containerStyle}>
              <View style={styles.navBar}>
                <Image source={require('../images/banner3.png')} style={{ width: 250, height: 50}} />
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
      }
  }
}

export default FriendFeed;

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
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
    top: 20,
    right: 9,
    position: 'absolute',
  },
  navBar: {
    height:80,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50,//50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

})