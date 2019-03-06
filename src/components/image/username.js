import React, { Component } from 'react';
import {Text, StyleSheet, View, Image,TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
// import { withNavigation } from 'react-navigation';
import HomeFeed from '../../screens/homefeed';
 
class Username extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: ""
    }
  }

  static navigationOptions = {
    header: null
  }

  goToUser() {
    console.log("touchy touch");
    this.props.navigation.navigate("User", {
      uid: this.props.uid
    });
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
    });
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
  text: {  
    fontSize: 16,
    fontFamily: 'AvenirNext-Bold',
    marginLeft: '2.5%'
  },
});
