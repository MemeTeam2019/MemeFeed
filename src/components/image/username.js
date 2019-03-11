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
    this.props.navigation.navigate('User', {
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
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: 10,
  },
});

export default Username;
