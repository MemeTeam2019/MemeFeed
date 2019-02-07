import React, { Component } from 'react';
import {Text, StyleSheet, View } from 'react-native';

 
class TileHeader extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>pic</Text>
        <Text style={styles.text}>@username</Text>
      </View>
    );
  }
}

export default TileHeader; 
 
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    height: 75
  },
  text: { 
    fontWeight: 'bold', 
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
  },
});












