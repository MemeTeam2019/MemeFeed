import React, { Component } from 'react';
import {Text, StyleSheet, View, Image,TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import HomeFeed from '../../screens/homefeed';
 
class Username extends React.Component {
  constructor(props){
    super(props);
  this.state= {username: ""};
}
static navigationOptions = {
    header: null
  }
goToUser(){
  console.log("touchy touch");
  this.props.navigation.navigate("User");
  }
componentDidMount() {
    const ref = firebase.firestore()
                .collection("Users").doc(this.props.uid);

    ref.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        let data = docSnapshot.data();
        if (data) {
          let username = data.username;
          this.setState({ username: username });
        }
      }
    })
    .catch(error => {
      console.log(error);
    })
  }


  render() {
    return (
      <TouchableOpacity onPress={() => this.goToUser()}>
        <Text style={styles.text}> {this.state.username} </Text>
      </TouchableOpacity>
    );
  }
}

export default Username; 
 
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
});
