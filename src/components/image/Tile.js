import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import ButtonBar from './ButtonBar';
import Photo from './Photo';
import TileHeader from './TileHeader';
import PostInfo from './PostInfo';


class Tile extends React.Component {

  render() {
    return ( 
      <View style={styles.container}>
        <TileHeader/>
        <Photo imageUrl={this.props.imageUrl}/>
        <ButtonBar memeId={this.props.memeId}/>
        <PostInfo memeId={this.props.memeId}/>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
export default Tile; 
 

