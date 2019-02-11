import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

 import AutoHeightImage from 'react-native-auto-height-image';
import Grid from 'react-native-grid-component';
 
class Photo extends React.Component {
  //     screenWidth: Dimensions.get("window").width

  render() {
    return (
        <View style={styles.modelStyle}>
            <AutoHeightImage
              width={Dimensions.get("window").width}
              source={{ uri: 'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg' }}
            />
        </View>
    );
  }
}


export default Photo; 
 
const styles = StyleSheet.create({
  fullImageStyle: {
    marginTop: '20%',
    width:Dimensions.get("window").width 
  },
  modelStyle: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});












