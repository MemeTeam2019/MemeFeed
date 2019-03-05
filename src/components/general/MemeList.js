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

class MemeList extends React.Component {
  constructor() {
    super();
    this.state = {
      memesLoaded: 30,
      imageuri: '',
      isLoading: true,
      memes: [],
    };
  }

  renderTile({item}){
    //for list view
    return <Tile
      memeId={item.key}
      imageUrl={item.src}
    />
  }

  render() {
      // List View
      return (
            <FlatList 
              style={styles.containerStyle}
              data={this.props.memes}
              renderItem={this.renderTile.bind(this)}
              onEndReached={() => {
              {/* ensuring there are actually memes to load */}
              if(this.props.memes.length ==  this.state.memesLoaded){
                newLoadCount = this.state.memesLoaded + 60;
                this.setState({
                  memesLoaded: newLoadCount,
                });

                {/* call parent function */}
                this.props.loadMemes(newLoadCount);
              }
            }}
            />
      );
    }
}

export default MemeList; 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
