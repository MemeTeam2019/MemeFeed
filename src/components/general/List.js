import * as React from 'react';
import firebase from 'react-native-firebase';
import Tile from '../image/Tile'

//import React in our project
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';

const uid = firebase.auth().currentUser.uid;

class List extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("Memes").orderBy('time', "desc");
    this.unsubscribe = null;
    this.state = {
      memesLoaded: 30,
      imageuri: '',
      isLoading: true,
      memes: [],
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

  renderTile({item}){
    //for list view
    return <Tile
      memeId={item.key}
      imageUrl={item.src}/>
  }

 
  render() {
      // List View
      return (
          <View>
            <FlatList 
              data={this.state.memes}
              renderItem={this.renderTile.bind(this)}
            />
          </View>
      );
    }
}

export default List; 
 
const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 160,
    margin: 1,
    aspectRatio: 1
  },
});
