import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

import MemeGrid from '../components/general/memeGrid';
import MemeList from '../components/general/memeList';
import Profile from './profilePage';

/**
 * View the profile of another user.
 *
 * Used by:
 *     mainNavigator.js
 *
 * Props:
 *     navigation.uid (String): Firebase id of the user profile we want to
 *         render.
 */

class FriendProfile extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.fetchMemes = this.fetchMemes.bind(this);
    this.state = {
      username: '',
      name: '',
      buttonText: '',
      followingLst: [],
      followersLst: [],
      updated: true,
      memes: [],
      oldestDoc: 0,
      selectGridButtonP: true,
      selectListButtonP: false,
      isFollowing: false,
      userExists: false,
      iconURL: '',
      refreshing: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      firebase
        .firestore()
        .collection('ReactsTest')
        .doc(this.props.navigation.getParam('uid'))
        .collection('Likes')
        .orderBy('time', 'desc')
        .limit(15)
        .get()
        .then(this.updateFeed);

      const myUid = firebase.auth().currentUser.uid;
      const theirUid = this.props.navigation.getParam('uid');
      const myUserRef = firebase
        .firestore()
        .collection('Users')
        .doc(myUid);
      const theirUserRef = firebase
        .firestore()
        .collection('Users')
        .doc(theirUid);

      theirUserRef.get().then((snapshot) => {
        this.setState(snapshot.data());
      });

      // Get the profile icon
      firebase
        .firestore()
        .collection('Users')
        .doc(theirUid)
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
          //console.log(error);
        });

      myUserRef
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data();
            const followingLst = data.followingLst || [];
            const isFollowing = followingLst.indexOf(theirUid) > -1;
            this.setState({
              isFollowing,
              buttonText: isFollowing ? 'Unfollow' : 'Follow',
              userExists: true,
            });
          } else {
            this.setState({ userExists: false });
          }
        })
        .catch((err) => {
          //console.log(err);
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchMemes = () => {
    // garentees not uploading duplicate memes by checking if memes have finished
    // updating
    if (this.state.updated) {
      this.state.updated = false;
      const oldestDoc = this.state.oldestDoc;
      firebase
        .firestore()
        .collection('ReactsTest')
        .doc(this.props.navigation.getParam('uid'))
        .collection('Likes')
        .orderBy('time', 'desc')
        .limit(15)
        .startAfter(oldestDoc)
        .get()
        .then(this.updateFeed);
    }
  };

  updateFeed = (querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
      const { time, url, rank, likedFrom, caption } = doc.data();
      const newMemes = [];
      if (rank > 1) {
        newMemes.push({
          key: doc.id,
          doc,
          src: url,
          time,
          likedFrom,
          caption,
          postedBy: this.props.navigation.getParam('uid'),
          poster: this.props.navigation.getParam('uid'),
        });
        this.setState((prevState) => {
          const mergedMemes = prevState.memes.concat(newMemes);
          return {
            memes: mergedMemes,
            updated: true,
            oldestDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
            refreshing: false,
          };
        });
      }
    });
  };

  refreshMemes = () => {
    this.setState({ memes: [], refreshing: true, oldestDoc: null }, () => {
      firebase
        .firestore()
        .collection('ReactsTest')
        .doc(this.props.navigation.getParam('uid', ''))
        .collection('Likes')
        .orderBy('time', 'desc')
        .limit(10)
        .get()
        .then(this.updateFeed);
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

  updateFollowing = async (followingState) => {
    const myUid = firebase.auth().currentUser.uid;
    const theirUid = this.props.navigation.getParam('uid');
    const myUserRef = firebase
      .firestore()
      .collection('Users')
      .doc(myUid);
    const theirUserRef = firebase
      .firestore()
      .collection('Users')
      .doc(theirUid);

    const nowFollowing = !followingState;

    // Get my myFollowingLst
    const followingLst = await myUserRef.get().then((mySnapshot) => {
      return mySnapshot.data().followingLst || [];
    });

    // Get theirFollowersLst
    const followersLst = await theirUserRef.get().then((theirSnapshot) => {
      return theirSnapshot.data().followersLst || [];
    });

    // Add myUid to theirFollowersLst and theirUid to myFollowingLst
    const inFollowingLst = followingLst.indexOf(theirUid) > -1;
    const inFollowersLst = followersLst.indexOf(myUid) > -1;
    if (nowFollowing) {
      if (!inFollowingLst) followingLst.push(theirUid);
      if (!inFollowersLst) followersLst.push(myUid);
    } else {
      if (inFollowingLst)
        followingLst.splice(followingLst.indexOf(theirUid), 1);
      if (inFollowersLst) followersLst.splice(followersLst.indexOf(myUid), 1);
    }

    theirUserRef.update({
      followersLst,
      followersCnt: followersLst.length,
    });
    myUserRef.update({
      followingLst,
      followingCnt: followingLst.length,
    });
    this.setState({
      isFollowing: nowFollowing,
      buttonText: nowFollowing ? 'Unfollow' : 'Follow',
      followersLst,
      followersCnt: followersLst.length,
    });

    // send follow notification to user
    if (nowFollowing) {
      firebase
        .firestore()
        .collection('NotificationsTest')
        .doc(theirUid)
        .collection('Notes')
        .add({
          type: 'follow',
          uid: myUid,
          time: Math.round(+new Date() / 1000),
          memeId: '',
          viewed: false,
        });
    }
    const theirLikes = firebase
      .firestore()
      .collection('ReactsTest')
      .doc(theirUid)
      .collection('Likes')
      .orderBy('time', 'desc') // most recent
      .limit(150);

    // If just followed an individual take their most recent 150 reactions and
    // add them to our Feed
    if (nowFollowing) {
      theirLikes.get().then((snapshot) => {
        snapshot.forEach((doc) => {
          const { time, likedFrom, url, rank } = doc.data();
          // Only add memes they have liked
          if (rank > 1) {
            const memeId = doc.id;
            const userLikedTime = time;
            const feedRef = firebase
              .firestore()
              .collection('FeedsTest')
              .doc(myUid)
              .collection('Likes')
              .doc(memeId);

            feedRef.get().then(async (feedDoc) => {
              // if this meme is already in this persons feed
              if (feedDoc.exists) {
                const { posReacts, feedTime } = feedDoc.data();
                const newPosReacts = posReacts + 1;
                const recentLikedTime = feedTime;

                // if the person we just followed has liked this meme more recently
                if (recentLikedTime < userLikedTime) {
                  feedRef.update({
                    posReacts: newPosReacts,
                    time: userLikedTime,
                    // add this user as someone that liked this meme
                    likers: firebase.firestore.FieldValue.arrayUnion(theirUid),
                    likedFrom: firebase.firestore.FieldValue.arrayUnion(
                      likedFrom
                    ),
                  });
                } else {
                  feedRef.update({
                    posReacts: newPosReacts,
                  });
                }
              } else {
                // doc doesn't exist
                // only make it exist if its a positive react
                firebase
                  .firestore()
                  .collection('FeedsTest')
                  .doc(myUid)
                  .collection('Likes')
                  .doc(memeId)
                  .set({
                    posReacts: 1,
                    time: userLikedTime,
                    url,
                    // add this user as someone that liked this meme
                    likers: [theirUid],
                    likedFrom: [likedFrom],
                  });
              }
            });
          }
        });
      });
    } else {
      theirLikes.get().then((snapshot) => {
        snapshot.forEach((doc) => {
          const { likedFrom, rank } = doc.data();
          // only remove memes they have liked
          if (rank > 1) {
            const memeId = doc.id;
            const feedRef = firebase
              .firestore()
              .collection('FeedsTest')
              .doc(myUid)
              .collection('Likes')
              .doc(memeId);

            feedRef.get().then(async (feedDoc) => {
              // if this meme is already in this persons feed
              if (feedDoc.exists) {
                const { posReacts, time } = feedDoc.data();
                const newPosReacts = posReacts - 1;
                let newTime = time;
                if (newPosReacts < 1) {
                  newTime = 0;
                }

                // if the person we just followed has liked this meme more recently
                if (rank > 1) {
                  feedRef.update({
                    posReacts: newPosReacts,
                    time: newTime,
                    // remove this user as someone that liked this meme
                    likers: firebase.firestore.FieldValue.arrayRemove(theirUid),
                    likedFrom: firebase.firestore.FieldValue.arrayRemove(
                      likedFrom
                    ),
                  });
                } else {
                  feedRef.update({
                    posReacts: newPosReacts,
                  });
                }
              }
            });
          }
        });
      });
    }
    // If unfollowing
  };

  // Function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const memes = [];
    querySnapshot.forEach((doc) => {
      const { time, url, rank, likedFrom, caption } = doc.data();
      if (rank > 1)
        memes.push({
          key: doc.id,
          doc,
          src: url,
          time,
          likedFrom,
          postedBy: this.props.navigation.getParam('uid'),
          poster: this.props.navigation.getParam('uid'),
          caption,
        });
      this.setState({ memes });
    });
  };

  render() {
    const uid = this.props.navigation.getParam('uid');
    const followingState = this.state.isFollowing;
    if (!this.state.userExists) {
      return (
        <View style={styles.containerStyle}>
          <Text style={{ color: '#ffffff', fontSize: 24 }}>
            Oops, this user doesn't exist. Sorry about that.
          </Text>
        </View>
      );
    }
    if (uid === firebase.auth().currentUser.uid) {
      return <Profile />;
    }

    if (this.state.memes.length === 0) {
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <Text style={styles.textSty4}>{this.state.username}</Text>
          </View>
          {/* Profile Pic, Follwers, Follwing Block */}
          <View style={styles.navBar2}>
            <View style={styles.leftContainer2}>
              <Image
                source={{ uri: this.state.iconURL }}
                style={{ width: 85, height: 85, borderRadius: 85 / 2 }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('FollowList', {
                  arrayOfUids: this.state.followingLst,
                  title: 'Following',
                });
              }}
            >
              <Text style={styles.textSty}>
                {' '}
                {this.state.followingCnt} {'\n'}{' '}
                <Text style={styles.textSty3}>Following</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rightContainer2}
              onPress={() => {
                this.props.navigation.push('FollowList', {
                  arrayOfUids: this.state.followersLst,
                  title: 'Followers',
                });
              }}
            >
              <View>
                <Text style={styles.textSty}>
                  {this.state.followersCnt} {'\n'}{' '}
                  <Text style={styles.textSty3}>Followers</Text>{' '}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* DISPLAY NAME */}
          <View style={styles.navBar1}>
            <View style={styles.leftContainer1}>
              <Text style={[styles.textSty2, { textAlign: 'left' }]}>
                {<Text style={styles.textSty2}>{this.state.name}</Text>}
              </Text>
            </View>

            <View style={styles.rightContainer1}>
              <TouchableOpacity
                onPress={() => this.updateFollowing(followingState)}
              >
                <Text style={styles.followBut}>
                  {' '}
                  {this.state.buttonText}{' '}
                  <Image
                    source={require('../images/follower2.png')}
                    style={{ width: 17, height: 17 }}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* DIFFERENT VIEW TYPE FEED BUTTONS */}
          <View style={styles.containerStyle2}>
            <Image
              source={require('../components/misc/noFriendLikes.png')}
              style={styles.tile}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.containerStyle}>
        <View style={styles.navBar}>
          <Text style={styles.textSty4}>{this.state.username}</Text>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={this.refreshMemes}
              refreshing={this.state.refreshing}
            />
          }
        >
          {/* Profile Pic, Follwers, Follwing Block */}
          <View style={styles.navBar2}>
            <View style={styles.leftContainer2}>
              <Image
                source={{ uri: this.state.iconURL }}
                style={{ width: 85, height: 85, borderRadius: 85 / 2 }}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.push('FollowList', {
                  arrayOfUids: this.state.followingLst,
                  title: 'Following',
                });
              }}
            >
              <Text style={styles.textSty}>
                {' '}
                {this.state.followingCnt} {'\n'}{' '}
                <Text style={styles.textSty3}>Following</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rightContainer2}
              onPress={() => {
                this.props.navigation.push('FollowList', {
                  arrayOfUids: this.state.followersLst,
                  title: 'Followers',
                });
              }}
            >
              <View>
                <Text style={styles.textSty}>
                  {this.state.followersCnt} {'\n'}{' '}
                  <Text style={styles.textSty3}>Followers</Text>{' '}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* DISPLAY NAME */}
          <View style={styles.navBar1}>
            <View style={styles.leftContainer1}>
              <Text style={[styles.textSty2, { textAlign: 'left' }]}>
                {<Text style={styles.textSty2}>{this.state.name}</Text>}
              </Text>
            </View>

            <View style={styles.rightContainer1}>
              <TouchableOpacity
                onPress={() => this.updateFollowing(followingState)}
              >
                <Text style={styles.followBut}>
                  {' '}
                  {this.state.buttonText}{' '}
                  <Image
                    source={require('../images/follower2.png')}
                    style={{ width: 17, height: 17 }}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* DIFFERENT VIEW TYPE FEED BUTTONS */}
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
          {this.state.selectListButtonP ? (
            <MemeList loadMemes={this.fetchMemes} memes={this.state.memes} />
          ) : (
            <MemeGrid loadMemes={this.fetchMemes} memes={this.state.memes} />
          )}
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(FriendProfile);

// import friend grid and pass the uid as a prop instead of the <ProfileGrid/> component ^^^
const styles = StyleSheet.create({
  containerStyle: {
    flex: 0,
    backgroundColor: '#ffffff',
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
    height: 55,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 0,
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
    paddingLeft: 1,
    paddingHorizontal: 10,
    marginRight: '9%',
    marginLeft: '9%',
    color: 'black',
  },
  textSty2: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
    color: 'black',
  },
  textSty3: {
    fontSize: 15,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    color: 'black',
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue-Bold',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: 'black',
  },
  textSty5: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    borderColor: '#778899',
    color: '#778899',
    borderWidth: 1,
    borderRadius: 5,
  },
  profilePic: {
    backgroundColor: 'white',
    elevation: 1,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 0,
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
    backgroundColor: 'white',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    backgroundColor: 'white',
    right: 9,
    position: 'absolute',
  },
  followBut: {
    fontSize: 17,
    fontFamily: 'AvenirNext-Regular',
    borderColor: '#A4A4A4',
    justifyContent: 'center',
    marginLeft: '9%',
  },
  followBut2: {
    width: '30%',
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navBar1: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer1: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 3,
    paddingHorizontal: 20,
  },
  rightContainer1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 1,
    marginLeft: '13%',
    paddingRight: 5,
  },
  rightIcon1: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  navBar2: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
