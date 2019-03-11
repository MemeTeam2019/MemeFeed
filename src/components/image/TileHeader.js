import React, { Component } from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import LikedFromReddit from './tileHeaders/likedFromReddit';
import LikedFromUser from './tileHeaders/likedFromUser';
import SourceReddit from './tileHeaders/sourceReddit';

import firebase from 'react-native-firebase';
 
class TileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    }
  }

  render() {
    return (
      <LikedFromReddit uid="F5bA3qC0dkca7h1INfoNNq4GIRh2"/>
    );

    // if just from reddit (a.k.a. on the explore page)
    // return (
    //   <View style={styles.containerA}>
    //     <View style={styles.container}>
    //       <Text style={{fontSize: 15}}>sourced from</Text>
    //     </View>
    //     <View style={styles.container}>
    //       <Text style={{fontSize: 15, fontWeight: 'bold'}}>'r/ThreadName'</Text>
    //     </View>
    //   </View>
    // );

    // // if someone liked from reddit
    // return (
    //   <View style={styles.containerA}>
    //     <View style={styles.container}>
    //       <Image 
    //         style={styles.userImg}
    //         source={{uri:'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'}}
    //       />
    //       <Username uid={this.props.uid} navigation={this.props.navigation} />
    //     </View>
    //     <View style={styles.container}>
    //       <Text style={{fontSize: 15}}>liked from   </Text>
    //       <Image 
    //         style={styles.likedFromImg}
    //         source={{uri:'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'}}
    //       />
    //       <Username uid={this.props.uid} navigation={this.props.navigation} />
    //     </View>
    //   </View>
    // );
    // // if there is someone that was liked from
    // return (
    //   <View style={styles.containerA}>
    //     <View style={styles.container}>
    //       <Image 
    //         style={styles.userImg}
    //         source={{uri:'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'}}
    //       />
    //       <Username uid={this.props.uid} navigation={this.props.navigation} />
    //     </View>
    //     <View style={styles.container}>
    //       <Text style={{fontSize: 15}}>liked from   </Text>
    //       <Image 
    //         style={styles.likedFromImg}
    //         source={{uri:'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'}}
    //       />
    //       <Username uid={this.props.uid} navigation={this.props.navigation} />
    //     </View>
    //   </View>
    // );
  }
}

export default withNavigation(TileHeader);
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5
  },
  containerA: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    height: 100,
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
