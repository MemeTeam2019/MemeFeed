import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import firebase from 'react-native-firebase';

import ProfileGrid from '../components/userProfile/ProfileGrid';
import Tile from '../components/image/Tile';
import MemeGrid from '../components/general/MemeGrid';
import MemeList from '../components/general/MemeList';

class FriendProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.memeRef = firebase
      .firestore()
      .collection('Reacts')
      .doc(this.props.navigation.getParam('uid'))
      .collection('Likes')
      .orderBy('time', 'desc');

    this.unsubscribe = null;
    this.state = {
      email: '',
      username: '',
      name: '',
      uid: '',
      followingLst: [],
      followersLst: [],
      open: false,
      selectGridButtonP: true,
      selectListButtonP: false,
      memes: [],
      items: [],
      text: '',
      ModalVisibleStatus: false,
      imageuri: '',
      isFollowing: false,
      buttonText: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.unsubscribe = this.memeRef
        .limit(60)
        .onSnapshot(this.onCollectionUpdate);

      const theirUid = this.props.navigation.getParam('uid');
      const theirUserRef = firebase
        .firestore()
        .collection('Users')
        .doc(theirUid);

      theirUserRef
        .get()
        .then(snapshot => {
          const myUid = firebase.auth().currentUser.uid;
          const data = snapshot.data();
          const followersLst = data.followersLst || [];
          const isFollowing = followersLst.indexOf(myUid) > -1;
          console.log(followersLst, myUid, isFollowing);
          this.setState(
            Object.assign(snapshot.data(), {
              isFollowing: isFollowing,
              buttonText: isFollowing ? 'Unfollow' : 'Follow',
            })
          );
        })
        .catch(err => {
          console.log(err);
        });
    }
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

  followButtonPress = () => {
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

    let isNowFollowing = !this.state.isFollowing;

    this.setState({
      buttonText: isNowFollowing ? 'Unfollow' : 'Follow',
      isFollowing: isNowFollowing,
    });

    // Update my followingLst and followingCnt
    myUserRef
      .get()
      .then(mySnap => {
        const myData = mySnap.data();
        let followingLst = myData.followingLst || [];

        const index = followingLst.indexOf(theirUid);
        if (isNowFollowing) {
          followingLst.push(theirUid);
        } else {
          followingLst.splice(index);
        }
        console.log(followingLst);
        myUserRef.update({
          followingCnt: followingLst.length,
          followingLst: followingLst,
        });
      })
      .catch(err => console.log(err));

    // Update their followersLst and followersCnt
    theirUserRef
      .get()
      .then(theirSnap => {
        const theirData = theirSnap.data();
        let followersLst = theirData.followersLst || [];

        const index = followersLst.indexOf(myUid);
        if (isNowFollowing) {
          followersLst.push(myUid);
        } else {
          followersLst.splice(index);
        }

        theirUserRef.update({
          followersCnt: followersLst.length,
          followersLst: followersLst,
        });
        this.setState({
          followersCnt: followersLst.length,
          followersLst: followersLst
        });
      })
      .catch(err => console.log(err));
  };

  // function for extracting Firebase responses to the state
  onCollectionUpdate = querySnapshot => {
    const memes = [];
    querySnapshot.forEach(doc => {
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
        memes,
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
    var optionArray = ['Logout', 'Cancel'];
      //Photo List/Full View of images
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <Text style={styles.textSty4}>{this.state.username}</Text>
          </View>
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
              onPress={() => {
                this.props.navigation.push('FollowList', {
                  arrayOfUids: this.state.followersLst,
                  title: 'Followers',
                });
              }}
            >
              <View style={styles.rightContainer2}>
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
              <TouchableOpacity onPress={() => this.followButtonPress()}>
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
        </View>
    );
  }
}
//import friend grid and pass the uid as a prop instead of the <ProfileGrid/> component ^^^
const styles = StyleSheet.create({
  containerStyle: {
    flex: 0,
    // alignItems: "center",
    // justifyContent: "center",
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 3,
    paddingHorizontal: 25,
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
    flexDirection: 'row',
    paddingRight: 3,
    paddingHorizontal: 25,
  },
  rightContainer2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 3,
    paddingHorizontal: 25,
  },
  rightIcon2: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
});

export default FriendProfileScreen;
