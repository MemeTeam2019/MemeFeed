import React, { Component } from 'react';
import {Button, StyleSheet, View, Image, Text, TouchableOpacity, Modal } from 'react-native';

import CommentPage from './CommentPage';

class Comment extends React.Component{

  constructor(){
    super();
    this.state = {
      username: '',
      text: '',
    };
  }


  render() {
    return(
      <View style={styles.postInfo}>
        <Text style={{fontWeight: 'bold', paddingTop: 10, marginLeft: '2.5%'}}>username
            <Text style={{fontWeight: 'normal'}}> comment</Text>
        </Text>
      </View>
    );

  }
}

export default Comment;


const styles = StyleSheet.create({
  container: {
      fontSize: 16,
      fontFamily: 'AvenirNext-Regular',
      width: '100%',
      height: 100,
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

});