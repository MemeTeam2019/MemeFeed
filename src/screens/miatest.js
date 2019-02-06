/*This is an Example of Grid Image Gallery in React Native*/
import * as React from 'react';
import firebase from 'react-native-firebase';

import Photo from '../components/image/Photo';
import Tile from '../components/image/Tile';

//import React in our project
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
//import all the needed components
 
import PhotoGrid from 'react-native-image-grid';
 
class HomeFeed extends React.Component {
  
  render() {
    return (
      <Tile/>
      );
  }
}
 
export default HomeFeed;
const styles = StyleSheet.create({

});

