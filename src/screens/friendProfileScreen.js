import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';

import Tile from '../components/image/tile';
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
    this.unsubscribe = null;
    this.memeRef = firebase
      .firestore()
      .collection('Reacts')
      .doc(this.props.navigation.getParam('uid'))
      .collection('Likes')
      .orderBy('time', 'desc');

    this.state = {
      email: '',
      username: '',
      name: '',
      uid: '',
      imageuri: '',
      text: '',
      buttonText: '',
      followingLst: [],
      followersLst: [],
      memes: [],
      items: [],
      selectGridButtonP: true,
      open: false,
      selectListButtonP: false,
      ModalVisibleStatus: false,
      isFollowing: false,
      userExists: false,
    };
  }

  componentDidMount(memesLoaded) {
    this._isMounted = true;
    if (this._isMounted) {
      if (!memesLoaded) {
        memesLoaded = 10;
      }
      this.unsubscribe = this.memeRef
        .limit(memesLoaded)
        .onSnapshot(this.onCollectionUpdate);

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

      myUserRef
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data();
            const followingLst = data.followingLst || [];
            const isFollowing = followingLst.indexOf(theirUid) > -1;
            this.setState({
              isFollowing: isFollowing,
              buttonText: isFollowing ? 'Unfollow' : 'Follow',
              userExists: true,
            });
          } else {
            this.setState({ userExists: false });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  componentWillUnmount() {
    this.unsubscribe = null;
  }

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

  updateFollowing = async () => {
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

    let nowFollowing = !this.state.isFollowing;

    // Get my myFollowingLst
    let followingLst = await myUserRef.get().then((mySnapshot) => {
      return mySnapshot.data().followingLst || [];
    });

    // Get theirFollowersLst
    let followersLst = await theirUserRef.get().then((theirSnapshot) => {
      return theirSnapshot.data().followersLst || [];
    });

    console.log('Before: ' + followingLst);

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
      followersLst: followersLst,
      followersCnt: followersLst.length,
    });
    myUserRef.update({
      followingLst: followingLst,
      followingCnt: followingLst.length,
    });
    this.setState({
      isFollowing: nowFollowing,
      buttonText: nowFollowing ? 'Unfollow' : 'Follow',
      followersLst: followersLst,
      followersCnt: followersLst.length,
    });

    const theirLikes = firebase
      .firestore()
      .collection('Reacts')
      .doc(theirUid)
      .collection('Likes')
      .where("rank", ">", 1) // only grab the memes they liked
      .orderBy('rank', 'desc') // highest rated
      // .orderBy('time', 'desc') // most recent
      .limit(150)

    // If just followed an individual take their most recent 150 reactions and
    // add them to our Feed
    if (nowFollowing) {
        theirLikes.get().then((snapshot) => {
          snapshot.forEach(function(doc) {
            console.log(doc.data());

            const { time, likedFrom, url} = doc.data();
            var memeId = doc.id
            const userLikedTime = time
            const feedRef = firebase
              .firestore()
              .collection('Feeds')
              .doc(myUid)
              .collection('Likes')
              .doc(memeId);

            feedRef
              .get()
              .then(async (doc) => {

                // if this meme is already in this persons feed
                if (doc.exists) {
                  console.log("doc exists")
                  const { posReacts, time } = doc.data();
                  const newPosReacts = posReacts+1
                  const recentLikedTime = time

                  // if the person we just followed has liked this meme more recently
                  if (recentLikedTime < userLikedTime) {
                    feedRef
                      .update({
                        posReacts: newPosReacts,
                        time: userLikedTime,
                        // add this user as someone that liked this meme
                        likers:
                          firebase.firestore.FieldValue.arrayUnion(theirUid),
                        likedFrom:
                          firebase.firestore.FieldValue.arrayUnion(likedFrom),
                      });
                    } else {
                      feedRef
                        .update({
                          posReacts: newPosReacts,
                        });
                    }
                } else {
                  console.log('doc does not exist')
                  // doc doesn't exist
                  // only make it exist if its a positive react
                  firebase
                    .firestore()
                    .collection('Feeds')
                    .doc(myUid)
                    .collection('Likes')
                    .doc(memeId)
                    .set({
                      posReacts: 1,
                      time: userLikedTime,
                      url: url,
                      // add this user as someone that liked this meme
                      likers: [theirUid],
                      likedFrom: [likedFrom]
                    });
                }
              });
          });
        });
      } else {
        theirLikes.get().then((snapshot) => {
          snapshot.forEach(function(doc) {
            const { time, likedFrom, url, rank} = doc.data();
            var memeId = doc.id
            const feedRef = firebase
              .firestore()
              .collection('Feeds')
              .doc(myUid)
              .collection('Likes')
              .doc(memeId);

            feedRef
              .get()
              .then(async (doc) => {
                // if this meme is already in this persons feed
                if (doc.exists) {
                  const { posReacts} = doc.data();
                  const newPosReacts = posReacts-1

                  // if the person we just followed has liked this meme more recently
                  if (rank > 1) {
                    feedRef
                      .update({
                        posReacts: newPosReacts,
                        // remove this user as someone that liked this meme
                        likers:
                          firebase.firestore.FieldValue.arrayRemove(theirUid),
                        likedFrom:
                          firebase.firestore.FieldValue.arrayRemove(likedFrom),
                      });
                    } else {
                      feedRef
                        .update({
                          posReacts: newPosReacts,
                        });
                    }
                }
              });
          });
        });
      }
      // If unfollowing
  };

  // Function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const memes = [];
    querySnapshot.forEach((doc) => {
      const { time, url, rank, likedFrom } = doc.data();
      if (rank > 1)
        memes.push({
          key: doc.id,
          doc, // DocumentSnapshot
          src: url,
          time,
          likedFrom,
          postedBy: this.props.navigation.getParam('uid'),
          poster: this.props.navigation.getParam('uid'),
        });

      this.setState({
        memes: memes,
        isLoading: false,
      });
    });
  };

  ShowModalFunction(visible, imageUrl) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageUrl,
      memeId: memeId,
    });
  }

  renderItem = (item, itemSize, itemPaddingHorizontal) => {
    //Single item of Grid
    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: itemSize,
          height: itemSize,
          paddingHorizontal: itemPaddingHorizontal,
        }}
        onPress={() => {
          this.ShowModalFunction(true, item.src);
        }}
      >
        <Image
          resizeMode="cover"
          style={{ flex: 1 }}
          source={{ uri: item.src }}
        />
      </TouchableOpacity>
    );
  };

  renderTile = ({ item }) => {
    return <Tile memeId={item.key} imageUrl={item.src} />;
  };

  render() {
    const uid = this.props.navigation.getParam('uid');
    if (!this.state.userExists) {
      return (
        <View style={styles.containerStyle}>
          <Text style={{ color: '#ffffff', fontSize: 24 }}>
            Oops, this user doesn't exist. Sorry about that.
          </Text>
        </View>
      );
    } else if (uid === firebase.auth().currentUser.uid) {
      return <Profile />;
    }

    return (
      <View style={styles.containerStyle}>
        <View style={styles.navBar}>
          <Text style={styles.textSty4}>{this.state.username}</Text>
        </View>
        <ScrollView>
          {/*Profile Pic, Follwers, Follwing Block*/}
          <View style={styles.navBar2}>
            <View style={styles.leftContainer2}>
              <Image
                source={require('../images/primePic.png')}
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

          {/*DISPLAY NAME*/}
          <View style={styles.navBar1}>
            <View style={styles.leftContainer1}>
              <Text style={[styles.textSty2, { textAlign: 'left' }]}>
                {<Text style={styles.textSty2}>{this.state.name}</Text>}
              </Text>
            </View>

            <View style={styles.rightContainer1}>
              <TouchableOpacity onPress={() => this.updateFollowing()}>
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
          {this.state.selectListButtonP ? (
            <MemeList
              loadMemes={this.componentDidMount}
              memes={this.state.memes}
            />
          ) : (
            <MemeGrid
              loadMemes={this.componentDidMount}
              memes={this.state.memes}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}
//import friend grid and pass the uid as a prop instead of the <ProfileGrid/> component ^^^
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
    paddingTop: 50, //50
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
    paddingTop: 0, //50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
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
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
  },
  textSty2: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
  },
  textSty3: {
    fontSize: 15,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    //fontWeight: 'bold',
    //color: '#778899',
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue-Bold',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
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
    paddingTop: 0, //10
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
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
  },
  followBut2: {
    width: '30%',
    marginLeft: 10, //20
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
    paddingHorizontal: 25,
  },
  rightContainer2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 1,
  },
  rightIcon2: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
});
export default FriendProfile;
