import React from 'react';
import { Image, TouchableOpacity, View, Modal, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

import Tile from '../components/image/tile';
import MemeGrid from '../components/general/memeGrid';
import MemeList from '../components/general/memeList';

class HomeFeed extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this._isMounted = false;
    this.unsubscribe = null;
    this.ref = firebase
      .firestore()
      .collection('Users')
      .doc(firebase.auth().currentUser.uid);
    this.state = {
      memesLoaded: 30,
      imageuri: '',
      ModalVisibleStatus: false,
      isLoading: true,
      inGridView: false,
      inFullView: true,
      memes: [],
      items: [],
      selectGridButton: false,
      selectListButton: true,
      following: [],
      memerefs: [],
    };
  }

  /**
   * Load memes which people I follow have reacted positively to.
   * 
   * Props
   * -----
   * None
   */
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.unsubscribe = firebase
        .firestore()
        .collection('Users')
        .doc(firebase.auth().currentUser.uid)
        .onSnapshot((doc) => {
          // The memes which my followers have reacted positively to
          let memes = [];

          // Save memeIds to ensure no duplicates
          let memeIds = new Set();

          const { followingLst } = doc.data();

          var i;
          // go through the people we are following and get their memes
          for (i = 0; i < followingLst.length; i++) {
            // grab friend uid
            let friendUid = followingLst[i];
            // go thru friends reacts
            firebase
              .firestore()
              .collection('Reacts/' + friendUid + '/Likes')
              .orderBy('time', 'desc')
              .limit(this.state.memesLoaded) //.limit(this.state.memesLoaded)
              .get()
              .then((snapshot) => {
                // look at each react
                snapshot.forEach((docMeme) => {
                  const { likedFrom, rank, time, url } = docMeme.data();
                  // haven't added yet and highly ranked
                  if (!memeIds.has(docMeme.id) && rank > 1) {
                    memeIds.add(docMeme.id);
                    let from = friendUid;
                    if (friendUid == firebase.auth().currentUser.uid) {
                      from = likedFrom;
                    }
                    console.log(docMeme.data(), friendUid);
                    memes.push({
                      key: docMeme.id,
                      doc, // DocumentSnapshot
                      src: url,
                      time,
                      likedFrom,
                      postedBy: from,
                      poster: friendUid,
                    });

                    function compareTime(a, b) {
                      if (a.time < b.time) return 1;
                      if (a.time > b.time) return -1;
                      return 0;
                    }
                    sortedMemes = memes.sort(compareTime);
                    this.setState({
                      memes: sortedMemes,
                      isLoading: false,
                    });
                  }
                });
              });
          }
        });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe = null;
  }

  ShowModalFunction(visible, imageURL, memeId) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
      memeId: memeId,
    });
  }
  showGridView = () => {
    //when grid button is pressed, show grid view
    this.setState({
      inGridView: true,
      inFullView: false,
    });
  };

  showFullView = () => {
    //when full button is bressed, show full view
    this.setState({
      inFullView: true,
      inGridView: false,
    });
  };
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
          this.ShowModalFunction(true, item.src, item.key);
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

  render() {
    if (this.state.ModalVisibleStatus) {
      //Modal to show full image with close button
      return (
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
          }}
        >
          <View style={styles.modelStyle}>
            {/* Single Image - Tile */}
            <Tile
              memeId={this.state.memeId}
              imageUrl={this.state.imageuri}
              likedFrom={item.friendUid}
              poster={item.postedBy}
            />
            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.closeButtonStyle}
              onPress={() => {
                this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
              }}
            >
              <Image
                source={{
                  uri:
                    'https://aboutreact.com/wp-content/uploads/2018/09/close.png',
                }}
                style={{ width: 25, height: 25, marginTop: 16 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      );
    } else if (this.state.memes.length == 0) {
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <Image
              source={require('../images/banner3.png')}
              style={{ width: 250, height: 50 }}
            />
          </View>
          <View style={styles.containerStyle2}>
            <Image
              source={require('../components/misc/emptyFriendTile.png')}
              style={styles.tile}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <Image
              source={require('../images/banner3.png')}
              style={{ width: 250, height: 50 }}
            />
          </View>
          <View style={styles.navBut}>
            <TouchableOpacity onPress={() => this.showFullView()}>
              <Image
                source={require('../images/fullFeedF.png')}
                style={{
                  opacity: this.state.inFullView ? 1 : 0.3,
                  width: 100,
                  height: 50,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.showGridView()}>
              <Image
                source={require('../images/gridFeedF.png')}
                style={{
                  opacity: this.state.inGridView ? 1 : 0.3,
                  width: 100,
                  height: 50,
                }}
              />
            </TouchableOpacity>
          </View>
          {this.state.inGridView ? (
            <MemeGrid
              loadMemes={this.componentDidMount}
              memes={this.state.memes}
            />
          ) : (
            <MemeList
              loadMemes={this.componentDidMount}
              memes={this.state.memes}
            />
          )}
        </View>
      );
    }
  }
}
export default HomeFeed;
const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
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
    top: 20,
    right: 9,
    position: 'absolute',
  },
  navBar: {
    height: 80,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50, //50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
