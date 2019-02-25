import React, { Component } from 'react';
import {Text, StyleSheet, View, Image } from 'react-native';

 
class TileHeader extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={styles.userImg}
          source={{uri:'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'}}/>
        <Text style={styles.text}>username</Text>
      </View>
    );
  }
}

export default TileHeader; 
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 30
  },
  text: { 
    fontWeight: 'bold', 
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: 10
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
});
