import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import firebase from 'react-native-firebase';

import Username from '../username';

class LikedFromReddit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconURL:
        'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon555.png?alt=media&token=48fb9bf8-4efb-490c-a178-13a9efb2289c',
    };
  }

  componentDidMount() {
    const uid = this.props.poster;
    firebase
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
          this.setState({
            iconURL: icon,
          });
        } else {
          console.log("doesn't exist");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  goToSubreddit = () => {
    this.props.navigation.push('SubReddit', {
      sub: this.props.sub,
    });
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  flagMeme = () => {
    const uid = firebase.auth().currentUser.uid;
    const memeId = this.props.memeId;
    const memeRef = firebase.firestore().doc(`MemesTest/${memeId}`);
    const feedRef = firebase.firestore().doc(`FeedsTest/${uid}/Likes/${memeId}`);
    const reactsRef = firebase.firestore().doc(`ReactsTest/${uid}/Likes/${memeId}`);

    memeRef
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const { numFlags } = docSnapshot.data();
          memeRef.update({ numFlags: numFlags + 1 || 1 });
        }
      })
      .catch((err) => {
        Alert.alert(
          'Oops!',
          'Something went wrong when flagging this image. Please contact us at memefeedaye@gmail.com',
          { text: 'Ok' }
        );
        console.log(err);
      });
    feedRef
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const { prevNumFlags } = docSnapshot.data();
          feedRef.update({ numFlags: prevNumFlags + 1 || 1 });
        }
      })
      .catch((err) => {
        Alert.alert(
          'Oops!',
          'Something went wrong when flagging this image. Please contact us at memefeedaye@gmail.com',
          { text: 'Ok' }
        );
        console.log(err);
      });
    reactsRef
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const { prevNumFlags } = docSnapshot.data();
          reactsRef.update({ numFlags: prevNumFlags + 1 || 1 });
        }
      })
      .catch((err) => {
        Alert.alert(
          'Oops!',
          'Something went wrong when flagging this image. Please contact us at memefeedaye@gmail.com',
          { text: 'Ok' }
        );
        console.log(err);
      });
  };

  render() {
    const optionArray = ['Inappropriate/Irrelevant', 'Cancel'];
    // if just from reddit (a.k.a. on the explore page)
    return (
      <View style={styles.navBar1}>
        <View style={styles.leftContainer1}>
          <View style={styles.container}>
            <Image
              style={styles.userImg}
              source={{ uri: this.state.iconURL }}
            />
            <Username
              uid={this.props.poster}
              navigation={this.props.navigation}
            />
            <Image
              style={styles.likedFromImg}
              source={require('../repostIcon.png')}
            />
            <TouchableOpacity onPress={() => this.goToSubreddit()}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  color: '#919191',
                  width: 800,
                }}
              >
                ' r/{this.props.sub}'
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer1}>
            <View style={styles.rightIcon1} />
            <TouchableOpacity onPress={this.showActionSheet}>
              <Text style={styles.report}>...</Text>
            </TouchableOpacity>
            <ActionSheet
              ref={(o) => {
                this.ActionSheet = o;
              }}
              options={optionArray}
              cancelButtonIndex={1}
              destructiveIndex={0}
              onPress={(index) => {
                if (optionArray[index] === 'Inappropriate/Irrelevant') {
                  this.flagMeme();
                }
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const hitSlop = { top: 15, bottom: 15, left: 15, right: 15 };

export default withNavigation(LikedFromReddit);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '85%',
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
    height: 95,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    marginLeft: 2
  },
  touchSpace: {
    padding: 5,
    fontSize: 15,
    fontFamily: 'AvenirNext-Bold',
    fontStyle: 'italic',
    color: '#919191',
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
    width: 900,
    marginRight: 2,
    paddingLeft: 5
  }

});
