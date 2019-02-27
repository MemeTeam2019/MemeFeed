import React, { Component } from 'react';
import {Text, StyleSheet, View, Image } from 'react-native';
 
class CommentHeader extends React.Component {

  render() {
    return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <Image source={require('../../images/Tile/comments.png')} style={{ width: 250, height: 50}} />
          </View>
        </View>
    );
  }
}

export default CommentHeader; 
 
const styles = StyleSheet.create({
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
  containerStyle: {
    flex: 0,
    backgroundColor: "#ffffff"
  },
});

