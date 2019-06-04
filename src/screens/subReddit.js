import * as React from 'react';
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

/**
 * View your own profile: followingLst, followersLst, Memes you have reacted 2+
 * to.
 *
 * Props
 * -----
 * None
 */
class SubReddit extends React.Component {
  static navigationOptions = ({navigation}) =>{
    return{
    title: "r/"+navigation.getParam('sub'),
    }; 
  };

  constructor(props) {
    super(props);
    this.refreshMemes = this.refreshMemes.bind(this);

    this.state = {
      selectGridButtonP: true,
      selectListButtonP: false,
      updated: true,
      memes: [],
      oldestDoc: null,
      refreshing: true,
      gridView: true,
    };
  }



  componentDidMount() {
    console.log('==========')
    console.log(this.props.navigation.getParam('sub'))
    this.unsubscribe = firebase
      .firestore()
      .collection('MemesTest')
      .where('sub', '==', this.props.navigation.getParam('sub'))
      .get()
      .then(this.updateFeed);
  }

  fetchMemes = () => {
    // garentees not uploading duplicate memes by checking if memes have finished
    // updating
    if (this.state.updated) {
      const oldestDoc = this.state.oldestDoc;
      if (oldestDoc) {
        firebase
          .firestore()
          .collection('MemesTest')
          .where('sub', '==', this.props.navigation.getParam('sub'))
          .startAfter(oldestDoc)
          .get()
          .then(this.updateFeed);
      }
    }
  };

  updateFeed = (querySnapshot) => {
    const newMemes = [];
    querySnapshot.docs.forEach((doc) => {
      const { url, time, sub } = doc.data();
      newMemes.push({
        key: doc.id,
        doc,
        src: url,
        time,
        sub,
        postedBy: sub,
      });

      const compareTime = (a, b) => {
        if (a.time > b.time) return -1;
        if (a.time < b.time) return 1;
        return 0;
      }

      newMemes.sort(compareTime)

    });



    Promise.all(newMemes).then((resolvedMemes) => {
      this.setState((prevState) => {
        var mergedMemes = prevState.memes.concat(resolvedMemes);

        return {
          memes: mergedMemes,
          updated: true,
          oldestDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
          refreshing: false,
        };
      });
    });
  };

  //comment sample line 53 (sorting the meme list)

   /**
   * Clear the currently loaded memes, load the first memes in this person's
   * feed
   */
  refreshMemes = () => {
    this.setState({ memes: [], refreshing: true, oldestDoc: null}, () => {
      firebase
        .firestore()
        .collection('MemesTest')
        .where('sub', '==', this.props.navigation.getParam('sub'))
        .get()
        .then(this.updateFeed);
    })
  };

  onGridViewPressedP = () => {
    this.setState({ selectGridButtonP: true });
    this.setState({ selectListButtonP: false });
  };

  onListViewPressedP = () => {
    this.setState({ selectGridButtonP: false });
    this.setState({ selectListButtonP: true });
  };



  renderItem(item, itemSize, itemPaddingHorizontal) {
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
          resizeMode='cover'
          style={{ flex: 1 }}
          source={{ uri: item.src }}
        />
      </TouchableOpacity>
    );
  }

  renderTile = ({ item }) => {
    return <Tile memeId={item.key} imageUrl={item.src} />;
  };


render() {
    const optionArray = ['About', 'Privacy Policy', 'Log Out', 'Cancel'];
    // Photo List/Full View of images
    return (
      <React.Fragment>
          <View style={styles.containerStyle}>
            {/* Profile Pic, Follwers, Follwing Block */}
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

          {this.state.selectGridButtonP ? (
            <MemeGrid loadMemes={this.fetchMemes} 
              memes={this.state.memes} 
              isSubRedditPg={true}
              refreshing={this.state.refreshing}
              onRefresh={this.refreshMemes}/>
          ) : (
            <MemeList loadMemes={this.fetchMemes} 
              memes={this.state.memes} 
              isSubRedditPg={true} 
              refreshing={this.state.refreshing}
              onRefresh={this.refreshMemes}/>
          )}
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
    paddingRight: 1,
    paddingLeft: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    marginRight: '9%',
    marginLeft: '9%',
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

  textshadow: {
    fontSize: 40,
    color: '#FFFFFF',
    fontFamily: 'Times New Roman',
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'white',
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
    right: 9,
    position: 'absolute',
    backgroundColor: 'white',
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
    backgroundColor: 'white',
  },
  followBut2: {
    borderWidth: 0.6,
    width: '25%',
    borderRadius: 3.5,
    marginLeft: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
   backgroundColor: 'white',
  },

  navBar2: {
    height: 100,
    backgroundColor: 'white',
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
        backgroundColor: 'white',
  },
  containerStyle2: {
    flex: 2,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
});

export default SubReddit;
