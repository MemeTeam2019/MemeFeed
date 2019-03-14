import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';

class Username extends React.Component {
  static navigationOptions = {
    header: null,
  };

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;

    const ref = firebase
      .firestore()
      .collection('Users')
      .doc(this.props.uid);

    ref
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          let data = docSnapshot.data();
          if (data && this._isMounted) {
            this.setState({ username: data.username });
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  goToUser() {
    console.log('touchy touch');
    this.props.navigation.navigate('FriendProfile', {
      uid: this.props.uid,
    });
  }


  render() {
    return (
      <TouchableOpacity onPress={() => this.goToUser()}>
        <Text style={styles.text}>{this.state.username}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {  
    fontSize: 16,
    fontFamily: 'AvenirNext-Bold',
    marginLeft: '2.5%'
  },
});

export default Username;
