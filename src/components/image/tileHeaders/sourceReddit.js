import React, { Component } from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import Username from '../username';

import firebase from 'react-native-firebase';
 
class SourceReddit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    }
  }

  render() {
    // if just from reddit (a.k.a. on the explore page)
    return (
      <View style={styles.containerA}>
        <View style={styles.container}>
          <Text style={{fontSize: 15}}>sourced from</Text>
        </View>
        <View style={styles.container}>
          <Text style={{fontSize: 15, fontWeight: 'bold', fontStyle: 'italic'}}>'r/{this.props.sub}'</Text>
        </View>
      </View>
    );
  }
}

export default withNavigation(SourceReddit);
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 0
  },
  containerA: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    height: 60,
    alignItems: 'center',
    marginTop: 30
  },
  text: {  
    fontSize: 16,
    fontFamily: 'AvenirNext-Bold',
    marginLeft: 10
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  likedFromImg: {
    width: 30,
    height: 30,
    borderRadius: 15
  }
});
