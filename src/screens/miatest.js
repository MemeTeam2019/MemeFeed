/*This is an Example of Grid Image Gallery in React Native*/
import * as React from 'react';
import firebase from 'react-native-firebase';

import Photo from '../components/image/Photo';
import ProfileGrid from '../components/userProfile/ProfileGrid';
import Tile from '../components/image/Tile';

//import React in our project
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
//import all the needed components

import PhotoGrid from 'react-native-image-grid';

class HomeFeed extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('MiaTestingMemePulling');
    this.unsubscribe = null;
    this.state = {
      imageuri: '',
      ModalVisibleStatus: false,
      isLoading: true,
      memes: [],
      items: [],
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

  render() {
    return (
      <View style={styles.tile}>
        <Tile/>
      </View>
      
      );
  }
}

export default HomeFeed;
const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff'
  }
});
