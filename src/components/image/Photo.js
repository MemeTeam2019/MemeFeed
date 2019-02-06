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
    containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
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
    top: 9,
    right: 9,
    position: 'absolute',
  },

  
  item: {
    flex: 1,
    height: 190,
    margin: 1,
  },
  list: {
    flex: 1,
    top: 800,
    right: 9,
    position: 'absolute',

  }
});












