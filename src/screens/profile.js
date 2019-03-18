import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import firebase from 'react-native-firebase';
import ActionSheet from 'react-native-actionsheet';

import Tile from '../components/image/Tile';
import MemeGrid from '../components/general/MemeGrid';
import MemeList from '../components/general/MemeList';

export default class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.infoListener = null;
    this._isMounted = false;
    this.userRef = firebase
      .firestore()
      .collection('Users')
      .doc(firebase.auth().currentUser.uid);
    this.ref = firebase
      .firestore()
      .collection('Reacts')
      .doc(firebase.auth().currentUser.uid)
      .collection('Likes')
      .orderBy('time', 'desc');

    this.state = {
      email: '',
      username: '',
      name: '',
      uid: '',
      followingCnt: 0,
      followersCnt: 0,
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
    };
  }

  componentDidMount(memesLoaded) {
    this._isMounted = true;
    if (this._isMounted) {
      this.unsubscribe = this.ref
        .limit(memesLoaded)
        .onSnapshot(this.onCollectionUpdate);
      this.infoListener = this.userRef.onSnapshot(snapshot =>
        this.setState(snapshot.data())
      );
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe = null;
    this.infoListener = null;
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = querySnapshot => {
    const memes = [];
    querySnapshot.forEach(doc => {
      console.log(doc.data());
      const { time, url, rank, likedFrom } = doc.data();
      if (rank > 1)
        memes.push({
          key: doc.id,
          doc, // DocumentSnapshot
          src: url,
          time,
          likedFrom,
          // this is to ensure that if a user changes their reaction to a meme
          // on their own page that the liked from source is still the same
          postedBy: likedFrom,
          poster: firebase.auth().currentUser.uid,
        });

      this.setState({
        memes,
        isLoading: false,
      });
    });
  };

  getUserInfo = () => {
    let firestore = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;
    firestore
      .collection('Users')
      .doc(uid)
      .get()
      .then(snapshot => {
        const data = snapshot.data();
        this.setState(Object.assign(data, { uid: uid }));
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

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('Auth');
      })
      .catch(err => {
        console.log(err);
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

  renderItem(item, itemSize, itemPaddingHorizontal) {
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
  }
  renderTile({ item }) {
    return <Tile memeId={item.key} imageUrl={item.src} />;
  }

  render() {
    var optionArray = ['Logout', 'Cancel'];

    if (this.state.memes.length == 0) {
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
                ref={o => (this.ActionSheet = o)}
                title={'User Settings'}
                options={optionArray}
                cancelButtonIndex={1}
                destructiveIndex={0}
                onPress={index => {
                  if (optionArray[index] == 'Logout') {
                    this.logout();
                  }
                }}
              />
            </View>
          </View>
          {/*Profile Pic, Follwers, Follwing Block*/}
          <View style={styles.navBar2}>
            <View style={styles.leftContainer2}>
              <Image
                source={require('../images/profilePic.png')}
                style={{ width: 85, height: 85, borderRadius: 85 / 2 }}
              />
            </View>
            <Text style={styles.textSty}>
              {' '}
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
    } else {
      //Photo List/Full View of images
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
                  ref={o => (this.ActionSheet = o)}
                  title={'User Settings'}
                  options={optionArray}
                  cancelButtonIndex={1}
                  destructiveIndex={0}
                  onPress={index => {
                    if (optionArray[index] == 'Logout') {
                      this.logout();
                    }
                  }}
                />
              </View>
            </View>

            {/*Profile Pic, Follwers, Follwing Block*/}

            <View style={styles.navBar2}>
              <View style={styles.leftContainer2}>
                <Image
                  source={require('../images/profilePic.png')}
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

        </React.Fragment>
      );
    }
  }
}

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
    height: 95,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50, //50
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
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 10, //50
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
    paddingTop: 50, //50
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
    borderColor: '#A4A4A4',
    color: '#5B5B5B',
    justifyContent: 'center',
  },
  followBut2: {
    borderWidth: 0.6,
    width: '25%',
    borderRadius: 3.5,
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
    //flexDirection: 'row',
    paddingRight: 2,
    paddingHorizontal: 25,
  },
  rightContainer2: {
    flex: 1,
    flexDirection: 'row',
    //justifyContent: 'flex-end',
    alignItems: 'center',
    paddingLeft: 1,
    paddingHorizontal: 25,
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
