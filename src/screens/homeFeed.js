import React from 'react';
import { Image, TouchableOpacity, View, Modal, Text, StyleSheet, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';

import MemeGrid from '../components/general/memeGrid';
import MemeList from '../components/general/memeList';
import SuggestUser from '../components/home/suggestUser'

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
      .collection('FeedsTest')
      .doc(firebase.auth().currentUser.uid)
      .collection('Likes')
      .orderBy('time', 'desc');
    this.state = {
      updated: true,
      oldestDoc: 0,
      memes: [],
      inGridView: false,
      inFullView: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      firebase
        .firestore()
        .collection('FeedsTest')
        .doc(firebase.auth().currentUser.uid)
        .collection('Likes')
        .orderBy('time', 'desc')
        .limit(15)
        .get()
        .then(this.updateFeed);
    }
  }

  fetchMemes = () => {
    // garentees not uploading duplicate memes by checking if memes have finished
    // updating
    if (this.state.updated) {
      this.state.updated = false;
      const oldestDoc = this.state.oldestDoc;
      firebase
        .firestore()
        .collection('FeedsTest')
        .doc(firebase.auth().currentUser.uid)
        .collection('Likes')
        .orderBy('time', 'desc')
        .limit(15)
        .startAfter(oldestDoc)
        .get()
        .then(this.updateFeed);
    }
  };

  updateFeed = (querySnapshot) => {
    const newMemes = [];
    querySnapshot.docs.forEach((doc) => {
      const { time, url, posReacts, likedFrom, likers } = doc.data();
      if (posReacts > 0) {
        const recentLikedFrom = likedFrom[likedFrom.length - 1];
        const recentLiker = likers[likers.length - 1];
        newMemes.push({
          key: doc.id,
          doc,
          src: url,
          time,
          likedFrom: recentLikedFrom,
          postedBy: recentLiker,
          poster: recentLiker,
        });
      }
    });

    Promise.all(newMemes).then((resolvedMemes) => {
      this.setState((prevState) => {
        const mergedMemes = prevState.memes.concat(resolvedMemes);
        return {
          memes: mergedMemes,
          updated: true,
          oldestDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        };
      });
    });
  };

  showGridView = () => {
    // When grid button is pressed, show grid view
    this.setState({
      inGridView: true,
      inFullView: false,
    });
  };

  showFullView = () => {
    // When full button is bressed, show full view
    this.setState({
      inFullView: true,
      inGridView: false,
    });
  };

  renderItem(item, itemSize, itemPaddingHorizontal) {
    // Single item of Grid
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
          resizeMode='cover'
          style={{ flex: 1 }}
          source={{ uri: item.src }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    if (this.state.memes.length === 0) {
      return (
        <View style={styles.container}>
          <View style={styles.containerStyle}>
            <View style={styles.navBar}>
              <Image
                source={require('../images/banner3.png')}
                style={{ width: 250, height: 50 }}
              />
            </View>
            <ScrollView>
            <View style={styles.containerStyle2}>
              <Image
                source={require('../components/misc/emptyFriendTile.png')}
                style={styles.tile}
              />
              <View style={styles.suggestText}>
                <Text style={styles.suggestText}> Looking for people to follow? </Text>
              </View>
              <View style={styles.suggestText}>
                <Text style={styles.suggestText}> Follow the creators of Meme Feed! </Text>
              </View>
              <View style={styles.suggestText}>
                <TouchableOpacity>
                  <Text style={styles.suggestText}> Mia </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.suggestText}>
                <TouchableOpacity>
                  <Text style={styles.suggestText}> Jon </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.suggestText}>
                <TouchableOpacity>
                  <Text style={styles.suggestText}> Siddhi </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.suggestText}>
                <TouchableOpacity>
                  <Text style={styles.suggestText}> Emma </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.suggestText}>
                <TouchableOpacity>
                  <Text style={styles.suggestText}> Zac </Text>
                </TouchableOpacity>
              </View>

            </View>
            </ScrollView>
          </View>
        </View>
      );
    }
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
          <MemeGrid loadMemes={this.fetchMemes} memes={this.state.memes} />
        ) : (
          <MemeList loadMemes={this.fetchMemes} memes={this.state.memes} />
        )}
      </View>
    );
  }
}

export default HomeFeed;

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    flex: 1,
  },
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    borderBottomWidth: .5,
    borderColor: '#D6D6D6',
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
    height: 85,
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
    borderBottomWidth: .5,
    borderColor: '#D6D6D6',
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
    borderBottomWidth: .5,
    borderColor: '#D6D6D6',
  },
  suggestText: {
    fontSize: 17,
    fontFamily: 'AvenirNext-Regular',
    color: 'black',
    justifyContent: 'center',
    marginTop: 2,
  }
});
