import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import firebase from 'react-native-firebase';
import moment from 'moment';

import Username from '../../image/username';


/**
 * Renders a Tagged Notification
 *
 * Used by:
 *    noteContainer.js
 *
 * Props:
 *     
 *      memeId(string): the meme affliated with the notification
 *      uid(string): the user affliated with the notification
 *      time(int): the time the notification was made
 *      viewed(boolean): wether the user has clicked it or not
 *
 */


class Followed extends React.Component {
  constructor(props) {
    super(props);
    this.notificationDot = require('../../../images/notificationDot.png');
    this.state = {
      iconURL: '',
    };
  }

  componentDidMount() {
    const uid = this.props.uid;
    const userRef = firebase
      .firestore()
      .collection('Users')
      .doc(uid);
    // Get the profile icon
    firebase
      .firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const { icon } = docSnapshot.data();
          this.setState({ iconURL: icon });
        } else {
          console.log("doesn't exist");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**
   * Converts the `time` field from the Firebase Meme document to
   * human-readable time.
   *
   * @param {number} unixTime - Time the meme was posted in unix time
   * @returns {string} Human-readable timestamp
   */
  convertTime = (unixTime) => {
    const theMoment = moment.unix(unixTime);
    if (theMoment.isValid()) {
      return theMoment.fromNow();
    }
    return 'a while ago';
  };

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
            <Text style={styles.text}>
              {` tagged you in a meme ${this.convertTime(this.props.time)}`}
            </Text>
          </View>
        </View>
        {!this.props.viewed && (
          <Image source={this.notificationDot} style={styles.notificationDot} />
        )}
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
    alignItems: 'center',
    marginTop: 5,
  },
  text: {
    fontSize: 12,
    fontFamily: 'AvenirNext-Regular',
    color: '#919191',
    fontWeight: '500',
  },
  userImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  navBar1: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#bbb',
    marginHorizontal: '3%',
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
  notificationDot: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
});
