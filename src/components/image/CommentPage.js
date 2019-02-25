import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import AddComment from './AddComment';
import CommentHeader from './CommentHeader';
import CommentList from './CommentList';
import TileHeader from './TileHeader';
import Photo from './Photo';

class CommentPage extends React.Component {
  render() {
    return ( 
      <View style={styles.container}>
        <CommentHeader/>
        <TileHeader/>
        <Photo imageUrl={this.props.imageUrl}/>
        <CommentList memeId={this.props.memeId}/>
        <AddComment memeId={this.props.memeId}/>
      </View>
    );
  }
}

export default CommentPage; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom:0
  },
});
 