import React from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import ButtonBar from './ButtonBar';
import Photo from './Photo';
import TileHeader from './TileHeader';
import PostInfo from './PostInfo';
 
class Tile extends React.Component {
  render() {
    return (
        <React.Fragment>
          <TileHeader/>
          <Photo/>
          <ButtonBar/>
          {/* <PostInfo/> */}
        </React.Fragment>
    );
  }
}


export default Tile; 
 

