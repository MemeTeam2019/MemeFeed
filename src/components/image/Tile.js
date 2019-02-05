import React from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TouchableOpacity, Image } from 'react-native';

import ButtonBar from './ButtonBar';
import Photo from './Photo';
import TileHeader from './TileHeader';
 
class Tile extends React.Component {
  render() {
    return (
        <React.Fragment>
          <TileHeader/>
          <Photo/>
          <ButtonBar/>
        </React.Fragment>
    );
  }
}


export default Tile; 
 

