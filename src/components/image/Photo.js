import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

 
import Grid from 'react-native-grid-component';
 
class Photo extends React.Component {

  // constructor(){
  //   super();
  //   this.state = {
  //     screenWidth: Dimensions.get("window").width
  //   }
  // }

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
    width: '100%',
    height: 250,
    marginTop: '20%'
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});












