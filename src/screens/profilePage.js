import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import firebase from 'react-native-firebase';
import ActionSheet from 'react-native-actionsheet';

import MemeGrid from '../components/general/memeGrid';
import MemeList from '../components/general/memeList';

/**
 * View your own profile: followingLst, followersLst, Memes you have reacted 2+
 * to.
 *
 * Props
 * -----
 * None
 */
export default class Profile extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.userListener = null;
    this._isMounted = false;
    this.ref = firebase
      .firestore()
      .collection('Reacts')
      .doc(firebase.auth().currentUser.uid)
      .collection('Likes')
      .orderBy('time', 'desc');

    this.state = {
      username: '',
      name: '',
      followingCnt: 0,
      followersCnt: 0,
      followingLst: [],
      followersLst: [],
      selectGridButtonP: true,
      selectListButtonP: false,
      updated: true,
      memes: [],
      oldestDoc: null,
      icon: '',
      refreshing: true,
    };
  }

  /**
   * When the component mounts get information regarding
   * their profile such as reactions, user image, followers, 
   * following, name, etc
   */
  componentDidMount() {
    const uid = firebase.auth().currentUser.uid;
    // Get the profile icon
    firebase
      .firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const { icon } = docSnapshot.data();
          this.setState({ icon });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch user info from Users collection
    firebase
      .firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then((snapshot) => this.setState(snapshot.data()));

    // Fetch the first 15 memes in this person's Reacts collection
    firebase
      .firestore()
      .collection('Reacts')
      .doc(firebase.auth().currentUser.uid)
      .collection('Likes')
      .orderBy('time', 'desc')
      .limit(15)
      .get()
      .then(this.updateFeed);
  }

  /**
   * Refresh the memes pulled for this user.
   */
  refreshMemes = () => {
    this.setState({ memes: [], refreshing: true, oldestDoc: null }, () => {
      this.componentDidMount();
    });
  };

  fetchMemes = () => {
    // garentees not uploading duplicate memes by checking if memes have finished
    // updating
    if (this.state.updated) {
      this.state.updated = false;
      const oldestDoc = this.state.oldestDoc;
      firebase
        .firestore()
        .collection('Reacts')
        .doc(firebase.auth().currentUser.uid)
        .collection('Likes')
        .orderBy('time', 'desc')
        .limit(15)
        .startAfter(oldestDoc)
        .get()
        .then(this.updateFeed);
    }
  };

  /**
   * Extract query snapshot from Reacts collection to this.state.memes in order
   * to pass as props to MemeList or MemeGrid
   */
  updateFeed = (reactsSnapshot) => {
    const newMemes = reactsSnapshot.docs.map(async (doc) => {
      const { likedFrom, rank, url } = doc.data();
      return firebase
        .firestore()
        .collection(`Memes`)
        .doc(doc.id)
        .get()
        .then((memeSnapshot) => {
          if (memeSnapshot.exists && rank > 1) {
            const { caption, time, numFlags } = memeSnapshot.data();
            return {
              key: doc.id,
              doc, // DocumentSnapshot
              src: url,
              time,
              likedFrom,
              // this is to ensure that if a user changes their reaction to a meme
              // on their own page that the liked from source is still the same
              postedBy: likedFrom,
              poster: firebase.auth().currentUser.uid,
              caption,
              numFlags,
            };
          }
          return null;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    Promise.all(newMemes).then((fulfilledMemes) => {
      this.setState((prevState) => {
        const mergedMemes = prevState.memes.concat(
          fulfilledMemes.filter((meme) => meme != null && meme.numFlags < 10)
        );
        return {
          memes: mergedMemes,
          updated: true,
          oldestDoc: reactsSnapshot.docs[reactsSnapshot.docs.length - 1],
          refreshing: false,
        };
      });
    });
  };

  /**
   * Fetch all user info from the Users collection
   */
  getUserInfo = () => {
    const uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection('Users')
      .doc(uid)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        this.setState(Object.assign(data, { uid }));
      });
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  onGridViewPressedP = () => {
    this.setState({ selectGridButtonP: true });
    this.setState({ selectListButtonP: false });
  };

  onListViewPressedP = () => {
    this.setState({ selectGridButtonP: false });
    this.setState({ selectListButtonP: true });
  };

  /**
   * Log the user out and take them to the login page.
   */
  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Auth');
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('Error logging out', 'Please try again', [{ text: 'OK' }]);
      });
  };

  render() {
    const optionArray = [
      'About',
      'Edit Profile Picture',
      'Privacy Policy',
      'Log Out',
      'Cancel',
    ];

    if (this.state.memes.length === 0 && !this.state.refreshing) {
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar1}>
            <View style={styles.leftContainer1}>
              <Text style={[styles.text, { textAlign: 'left' }]}>{}</Text>
            </View>
            <Text style={styles.textSty4}>{this.state.username}</Text>
            <View style={styles.rightContainer1}>
              <View style={styles.rightIcon1} />
              <TouchableOpacity onPress={this.showActionSheet}>
                <Image
                  source={require('../images/setting.png')}
                  style={{ width: 60, height: 30 }}
                />
              </TouchableOpacity>
              <ActionSheet
                ref={(o) => {
                  this.ActionSheet = o;
                }}
                title='User Settings'
                options={optionArray}
                cancelButtonIndex={4}
                destructiveIndex={0}
                onPress={(index) => {
                  if (optionArray[index] === 'Log Out') {
                    this.logout();
                  } else if (optionArray[index] === 'About') {
                    this.props.navigation.push('InfoStack');
                  } else if (optionArray[index] === 'Privacy Policy') {
                    this.props.navigation.push('Privacy');
                  } else if (optionArray[index] === 'Edit Profile Picture') {
                    this.props.navigation.push('ProfilePic');
                  }
                }}
              />
            </View>
          </View>
          {/* Profile Pic, Follwers, Follwing Block */}
          <View style={styles.navBar2}>
            <View style={styles.leftContainer2}>
              <Image
                source={{ uri: this.state.icon }}
                style={{ width: 85, height: 85, borderRadius: 85 / 2 }}
              />
            </View>
            <Text style={styles.textSty}>
              {this.state.followingCnt} {'\n'}{' '}
              <Text style={styles.textSty3}>Following</Text>
            </Text>
            <View style={styles.rightContainer2}>
              <Text style={styles.textSty}>
                {this.state.followersCnt} {'\n'}{' '}
                <Text style={styles.textSty3}>Followers</Text>{' '}
              </Text>
            </View>
          </View>
          {/*DISPLAY NAME*/}
          <View style={styles.profilePic}>
            <Text style={styles.textSty2}>{this.state.name}</Text>
            <Text> </Text>
            <Text> </Text>
          </View>
          <View style={styles.containerStyle2}>
            <Image
              source={require('../components/misc/noLikes.png')}
              style={styles.tile}
            />
          </View>
        </View>
      );
    }
    // Photo List/Full View of images
    return (
      <React.Fragment>
        <View style={styles.containerStyle}>
          <View style={styles.navBar1}>
            <View style={styles.leftContainer1}>
              <Text style={[styles.text, { textAlign: 'left' }]}>{}</Text>
            </View>
            <Text style={styles.textSty4}>{this.state.username}</Text>
            <View style={styles.rightContainer1}>
              <View style={styles.rightIcon1} />
              <TouchableOpacity onPress={this.showActionSheet}>
                <Image
                  source={require('../images/setting.png')}
                  style={{ width: 60, height: 30 }}
                />
              </TouchableOpacity>
              <ActionSheet
                ref={(o) => (this.ActionSheet = o)}
                title={'User Settings'}
                options={optionArray}
                cancelButtonIndex={4}
                destructiveIndex={0}
                onPress={(index) => {
                  if (optionArray[index] == 'Log Out') {
                    this.logout();
                  } else if (optionArray[index] == 'About') {
                    this.props.navigation.push('InfoStack');
                  } else if (optionArray[index] == 'Privacy Policy') {
                    this.props.navigation.push('Privacy');
                  } else if (optionArray[index] === 'Edit Profile Picture') {
                    this.props.navigation.push('ProfilePic');
                  }
                }}
              />
            </View>
          </View>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={this.refreshMemes}
              refreshing={this.state.refreshing}
            />
          }
        >
          <View style={styles.containerStyle}>
            {/* Profile Pic, Follwers, Follwing Block */}
            <View style={styles.navBar2}>
              {/* Profile Picture */}
              <View style={styles.leftContainer2}>
                <Image
                  source={{ uri: this.state.icon }}
                  style={{ width: 85, height: 85, borderRadius: 85 / 2 }}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('FollowList', {
                    arrayOfUids: this.state.followingLst,
                    title: 'Following',
                  });
                }}
              >
                <Text style={styles.textSty}>
                  {this.state.followingLst.length} {'\n'}
                  <Text style={styles.textSty3}>Following</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rightContainer2}
                onPress={() => {
                  this.props.navigation.navigate('FollowList', {
                    arrayOfUids: this.state.followersLst,
                    title: 'Followers',
                  });
                }}
              >
                <View>
                  <Text style={styles.textSty}>
                    {this.state.followersLst.length} {'\n'}{' '}
                    <Text style={styles.textSty3}>Followers</Text>{' '}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/*DISPLAY NAME*/}
            <View style={styles.profilePic}>
              <Text style={styles.textSty2}>{this.state.name}</Text>
            </View>
            {/*DIFFERENT VIEW TYPE FEED BUTTONS*/}
            <View style={styles.navBut}>
              <TouchableOpacity onPress={() => this.onListViewPressedP()}>
                <Image
                  source={require('../images/fullFeedF.png')}
                  style={{
                    opacity: this.state.selectListButtonP ? 1 : 0.3,
                    width: 100,
                    height: 50,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.onGridViewPressedP()}>
                <Image
                  source={require('../images/gridFeedF.png')}
                  style={{
                    opacity: this.state.selectGridButtonP ? 1 : 0.3,
                    width: 100,
                    height: 50,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          {this.state.selectListButtonP ? (
            <MemeList loadMemes={this.fetchMemes} memes={this.state.memes} />
          ) : (
            <MemeGrid loadMemes={this.fetchMemes} memes={this.state.memes} />
          )}
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 0,
    backgroundColor: 'white',
  },
  headerSty: {
    height: 0,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
  },
  animatedBox: {
    flex: 1,
    backgroundColor: '#38C8EC',
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812',
  },
  navBar: {
    height: 95,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
  },
  navBut: {
    height: 50,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSty: {
    fontSize: 17,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 1,
    color: 'black',
    paddingLeft: 1,
    paddingHorizontal: 10,
    marginRight: '9%',
    marginLeft: '9%',
  },
  textSty2: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    color: 'black',
    paddingHorizontal: 10,
  },
  textSty3: {
    fontSize: 15,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    color: 'black',
    paddingHorizontal: 10,
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue-Bold',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  textSty5: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    color: '#778899',
  },
  profilePic: {
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
  },
  textshadow: {
    fontSize: 40,
    color: '#FFFFFF',
    fontFamily: 'Times New Roman',
    paddingLeft: 30,
    paddingRight: 30,
    textShadowColor: '#585858',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 20,
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
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
    top: 9,
    right: 9,
    position: 'absolute',
  },
  navBar1: {
    height: 95,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  leftContainer1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  rightContainer1: {
    flex: 1,
    width: 200,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  rightIcon1: {
    height: 10,
    width: 20,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  followBut: {
    fontSize: 17,
    fontFamily: 'AvenirNext-Regular',
    color: '#5B5B5B',
    justifyContent: 'center',
  },
  followBut2: {
    width: '25%',
    marginLeft: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  navBar2: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  leftContainer2: {
    flex: 1,
    paddingRight: 2,
    paddingLeft: '3%',
    paddingHorizontal: '5%',
    backgroundColor: 'white',
  },
  rightContainer2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  rightIcon2: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  tile: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  containerStyle2: {
    flex: 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
});