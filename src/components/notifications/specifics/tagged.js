import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import Username from '../../image/username';
import ActionSheet from 'react-native-actionsheet';

import firebase from 'react-native-firebase';

class Followed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      iconURL: '',
    };
  }

  componentDidMount() {
    const uid = this.props.uid;
    const userRef = firebase
      .firestore()
      .collection('Users')
      .doc(uid);
    //get the profile icon
    firebase
      .firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const { icon } = docSnapshot.data();
          this.state.iconURL = icon;
          console.log(this.state.iconURL);
          console.log(icon);
        } else {
          console.log("doesn't exist");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    userRef
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        this.setState({ username: data.username });
      })
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <View style={styles.navBar1}>
        <View style={styles.leftContainer1}>
          <View style={styles.container}>
            <Image
              style={styles.userImg}
              source={{ uri: this.state.iconURL }}
            />
            <Username uid={this.props.uid} navigation={this.props.navigation} />
            <Text
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                fontStyle: 'italic',
                color: '#919191',
                width: 800,
              }}
            >
              {' '}
              tagged you in a meme
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Followed;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  containerA: {
    flexDirection: 'column',
    width: '100%',
    height: 50,
    alignItems: 'center',
    marginTop: 30,
    borderBottomWidth: 0.5,
    borderColor: '#D6D6D6',
    //borderTopWidth: .5,
    paddingTop: 7,
  },
  text: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Bold',
    marginLeft: 10,
  },
  userImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 2,
  },
  likedFromImg: {
    width: 30,
    height: 25,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navBar1: {
    height: 70,
    paddingTop: 10, //50
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftContainer1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '80%',
  },
  rightContainer1: {
    flex: 1,
    width: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  rightIcon1: {
    height: 10,
    width: 20,
    resizeMode: 'contain',
  },
  report: {
    fontFamily: 'AvenirNext-Bold',
    marginRight: 10,
    fontSize: 20,
    marginBottom: 5,
    color: '#919191',
    backgroundColor: 'white',
    marginLeft: 2,
  },
});
