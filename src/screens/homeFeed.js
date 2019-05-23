import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';
import MemeGrid from '../components/general/memeGrid';
import MemeList from '../components/general/memeList';
import SuggestUser from '../components/home/suggestUser';

class HomeFeed extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.unsubscribe = null;
    this.fetchMemes = this.fetchMemes.bind(this);
    this.state = {
      updated: true,
      oldestDoc: null,
      memes: [],
      inGridView: false,
      inFullView: true,
      refreshing: true,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('Feeds')
      .doc(firebase.auth().currentUser.uid)
      .collection('Likes')
      .orderBy('time', 'desc')
      .limit(15)
      .get()
      .then(this.updateFeed);
  }

  fetchMemes = () => {
    // garentees not uploading duplicate memes by checking if memes have finished
    // updating
    if (this.state.updated) {
      this.state.updated = false;
      const oldestDoc = this.state.oldestDoc;
      firebase
        .firestore()
        .collection('Feeds')
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
      const { time, url, posReacts, likedFrom, likers, caption } = doc.data();
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
          caption,
        });
      }
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
  };

  refreshMemes = () => {
    this.setState({ memes: [], refreshing: true, oldestDoc: null }, () => {
      firebase
        .firestore()
        .collection('Feeds')
        .doc(firebase.auth().currentUser.uid)
        .collection('Likes')
        .orderBy('time', 'desc')
        .limit(15)
        .get()
        .then(this.updateFeed);
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
    if (this.state.memes.length === 0 && !this.state.refreshing) {
      return (
        <View style={styles.container}>
          <View style={styles.containerStyle3}>
            <View style={styles.navBar}>
              <Image
                source={require('../images/banner3.png')}
                style={{ width: 250, height: 50 }}
              />
            </View>

            <View style={styles.containerStyle2}>
              <ScrollView
                ref={(ref) => {
                  this.scrollView = ref;
                }}
              >
                <Image
                  source={require('../components/misc/suggest.png')}
                  style={styles.tile}
                />

                <View>
                  <SuggestUser
                    icon={
                      'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon888.png?alt=media&token=05558df6-bd5b-4da1-9cce-435a419347a0'
                    }
                    name={'Mia Altieri'}
                    username={'Me-uh'}
                    uid={'WuTqG2y7GWN7KCmgRbLiyddMqax1'}
                  />

                  <SuggestUser
                    icon={
                      'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon888.png?alt=media&token=05558df6-bd5b-4da1-9cce-435a419347a0'
                    }
                    name={'Jon Chong'}
                    username={'dabid'}
                    uid={'kuPNgqTDnhRHvswbecGI7ApZ9GW2'}
                  />

                  <SuggestUser
                    icon={
                      'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon111.png?alt=media&token=05558df6-bd5b-4da1-9cce-435a419347a0'
                    }
                    name={'Siddhi Panchal'}
                    username={'siddhiiiii'}
                    uid={'3khrPuSqO4XhPKWuz2gSoNFGgdA2'}
                  />

                  <SuggestUser
                    icon={
                      'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon888.png?alt=media&token=05558df6-bd5b-4da1-9cce-435a419347a0'
                    }
                    name={'Emma Pedersen'}
                    username={'erpeders'}
                    uid={'g9Nat9KDVMStAHjNOQNfPLVU9Sk1'}
                  />

                  <SuggestUser
                    icon={
                      'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon555.png?alt=media&token=05558df6-bd5b-4da1-9cce-435a419347a0'
                    }
                    name={'Zac Plante'}
                    username={'jesuisouef'}
                    uid={'MhPMJTBeB1UC1PAlnnN6YhDVcOi2'}
                  />
                </View>
              </ScrollView>
            </View>
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
          <MemeGrid
            loadMemes={this.fetchMemes}
            memes={this.state.memes}
            refreshing={this.state.refreshing}
            onRefresh={this.refreshMemes}
          />
        ) : (
          <MemeList
            loadMemes={this.fetchMemes}
            memes={this.state.memes}
            refreshing={this.state.refreshing}
            onRefresh={this.refreshMemes}
          />
        )}
      </View>
    );
  }
}

export default HomeFeed;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    borderBottomWidth: 0.5,
    borderColor: '#D6D6D6',
  },
  containerStyle3: {
    justifyContent: 'center',
    flex: 1,
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
    paddingTop: 50,
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
    borderBottomWidth: 0.5,
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
    borderBottomWidth: 0.5,
    borderColor: '#D6D6D6',
  },
  suggestText: {
    fontSize: 17,
    fontFamily: 'AvenirNext-Regular',
    color: 'black',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 5,
  },
});
