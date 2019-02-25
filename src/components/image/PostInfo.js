import React, { Component } from 'react';
import {Button, StyleSheet, View, Image, Text } from 'react-native';
import firebase from "react-native-firebase";

class PostInfo extends React.Component{

constructor(props){
  super(props);
  this.state = {
<<<<<<< HEAD
    source: "author"
  };
}

render() {
  return (
    <View style={styles.postInfo}>
      <Text style={{fontStyle: 'italic', fontWeight: 'bold', marginLeft: '2.5%'}}>{this.state.source}</Text>
      <Text style={{fontWeight: 'bold', paddingTop: 3, marginLeft: '2.5%'}}>{this.props.reactCount} Reactions</Text>
=======
    reactCount: 0,
  };
}

componentDidMount() {
    this.getNumReaction();
}

getNumReaction(){
  const memeid = this.props.memeId
  const ref = firebase.firestore().collection("Memes").doc(memeid)

  ref.get().then(docSnapshot => {
      const data = docSnapshot.data();
      console.log(data);
      const reactCount = data.reactCount || 0;
      this.setState({reactCount: reactCount})
  })
}

render() {
  return (
    <View style={styles.postInfo}>
      <Text style={{fontStyle: 'italic', fontWeight: 'bold', marginLeft: '2.5%'}}>source</Text>
      <Text style={{fontWeight: 'bold', paddingTop: 3, marginLeft: '2.5%'}}>{this.state.reactCount} Reactions</Text>
>>>>>>> origin/emma_stuff2
      <Text style={{fontWeight: 'bold', paddingTop: 10, marginLeft: '2.5%'}}>username
          <Text style={{fontWeight: 'normal'}}> comment</Text>
      </Text>
    </View>
    );
  }
}

export default PostInfo;

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
