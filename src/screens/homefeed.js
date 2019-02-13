/*This is an Example of Grid Image Gallery in React Native*/
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

class HomeFeed extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('MiaTestingMemePulling').orderBy('time', "desc");
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
    };
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const memes = [];
    querySnapshot.forEach((doc) => {
      const { image, time} = doc.data();
      memes.push({
        key: doc.id,
        doc, // DocumentSnapshot
        src: image,
        time,
      });
    });
    this.setState({
      memes,
      isLoading: false,
   });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);

    var that = this;
    let items = Array.apply(null, Array(60)).map((v, i) => {
      //Using demo placeholder images but you can add your images here
      return { id: i, src: 'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'};
    });
    that.setState({ items });
  }
  // renderHeader() {
  //   //Header of the Screen
  //   return <Text style={{padding:19, fontSize:20, color:'black', backgroundColor:'white'}}>
  //              Recent
  //          </Text>;
  // }
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
          this.ShowModalFunction(true, item.src);
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
    return <Tile/>
  }

  render() {
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
              {/* logo */}
              <Image source={require('../images/banner3.png')} style={{ width: 230, height: 50}} />
              {/* full feed button */}
              <TouchableOpacity>
                <Image
                  source={require('../images/fullFeed4.png')} style={{ width: 50, height: 50}}
                />
              </TouchableOpacity>
              {/* grid feed button */}
              <TouchableOpacity 
              activeOpacity={0.5}
              onPress={this.showGridView}
              >
                <Image
                  source={require('../images/boxFeed4.png')} style={{ width: 50, height: 50}}
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
        <Image source={require('../images/general.png')} style={{ width: 250, height: 50}} />
        </View>
        <View style={styles.navBut}>
        <TouchableOpacity onPress={() => this.onListViewPressed()}>
        <Image
        source={require('../images/fullFeedF.png')} style={{ opacity:  this.state.selectListButton
                                                              ? 1 : 0.3,
                                                            width: 100, height: 50}}
        />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.onGridViewPressed()}>
        <Image
        source={require('../images/gridFeedF.png')} style={{ opacity:  this.state.selectGridButton
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
  }
}

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
});
