import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
 
import Grid from 'react-native-grid-component';
 
class Photo extends React.Component {

 
  render() {
    return (
        <View style={styles.modelStyle}>
            <Image
              style={styles.fullImageStyle}
              source={{ uri: 'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg' }}
            />
        </View>
    );
  }
}


export default Photo; 
 
const styles = StyleSheet.create({
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
    width: '100%',
    //resizeMode: 'center',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});












