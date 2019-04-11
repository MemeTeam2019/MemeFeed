import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';

import { withNavigation } from 'react-navigation';

/**
 * Handles user reacts for a specific meme, sets the state of tile.js and
 * updates the appropriate firebase documents.
 *
 * Used by:
 *    tile.js
 *    commentList.js
 *
 * Props:
 *    memeId (String): The id of the Firebase document in the Memes collection
 *    imageUrl (String): The image URL of the meme
 *    postedBy (String): uid of the user who posted the meme associated with
 *        the memeId
 *    updateReacts (Function): Function to setState of tile's reactCount state
 */
class ButtonBar extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      selectedButton: null,
      userHasReacted: false,
    };
    this.emojiRank = {
      0: '../../images/Tile/button0.png',
      1: '../../images/Tile/button1.png',
      2: '../../images/Tile/button2.png',
      3: '../../images/Tile/button3.png',
      4: '../../images/Tile/button4.png',
    };
    this.UnclickedEmojiRank = {
      0: '../../images/Tile/button0Fade.png',
      1: '../../images/Tile/button1Fade.png',
      2: '../../images/Tile/button2Fade.png',
      3: '../../images/Tile/button3Fade.png',
      4: '../../images/Tile/button4Fade.png',
    };
  }

  componentWillUnmount() {
    this.unsubscribe = null
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    const memeId = this.props.memeId;
    const ref = firebase
      .firestore()
      .collection('Reacts')
      .doc(user.uid)
      .collection('Likes')
      .doc(memeId);

    ref
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          let data = docSnapshot.data();
          if (data) {
            let rank = data.rank;
            this.setState({ selectedButton: rank == -1 ? null : rank });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _onPressButton = async (newReact) => {

    const oldReact = this.state.selectedButton;
    this.setState({
      selectedButton: newReact === oldReact ? null : newReact,
    });

    const user = firebase.auth().currentUser;
    const memeId = this.props.memeId;

    // Update the Reacts collection for current uid
    const reactRef = firebase
      .firestore()
      .collection('Reacts')
      .doc(user.uid)
      .collection('Likes')
      .doc(memeId);
    const memeRef = firebase
      .firestore()
      .collection('Memes')
      .doc(memeId);
    const date = Math.round(+new Date() / 1000);

    reactRef.get().then((likesSnapshot) => {
      const data = likesSnapshot.data();
      var hasReacted = likesSnapshot.exists && data.rank !== -1;
      console.log(this.props.postedBy);
      reactRef.set({
        rank: oldReact === newReact ? -1 : newReact,
        time: date,
        url: this.props.imageUrl,
        likedFrom: this.props.postedBy,
      });
      memeRef
        .get()
        .then(async (memeSnapshot) => {
          const data = memeSnapshot.data();
          let newReactCount = 0;
          console.log(hasReacted);
          if (!hasReacted) {
            newReactCount = data.reactCount + 1 || 1;
          } else if (hasReacted && oldReact === newReact) {
            newReactCount = data.reactCount - 1;
          } else {
            newReactCount = data.reactCount;
          }
          memeRef.update({ reactCount: newReactCount });
          this.props.updateReacts(newReactCount);
        })
        .catch((err) => {
          console.log(err);
        });
    });


    // grab this users follower list
    // go through each follower,and get that f_uid
    // add to the collection Feeds/f_uid and add that react
    this.unsubscribe = firebase
      .firestore()
      .collection('Users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(async (doc) => {
        const { followersLst } = doc.data();
        // go through the people are following us
        var i;
        for (i = 0; i < followersLst.length; i++) {
          // grab friend uid
          let friendUid = followersLst[i];
          firebase
            .firestore()
            .collection('Feeds')
            .doc(friendUid)
            .collection('Likes')
            .doc(memeId)
            .get()
            .then(async (doc) => {

              if (doc.exists) {
                const { posReacts } = doc.data();
                // originally did not like the meme but now does
                // or first time liking the meme and ranking it highly
                // then add to the total number of positive votes
                if ((oldReact < 2 && newReact > 1 && oldReact != newReact) ||
                    (oldReact === null && newReact > 1)) {
                    const newPosReacts = posReacts+1
                    firebase
                      .firestore()
                      .collection('Feeds')
                      .doc(friendUid)
                      .collection('Likes')
                      .doc(memeId)
                      .update({
                        posReacts: newPosReacts,
                        time: date,
                        url: this.props.imageUrl,
                        likedFrom: this.props.postedBy,
                        // add this user as someone that liked this meme
                        likers:
                          firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
                      });
                }

                // originally liked the meme, but now does not
                // OR unreacting to meme
                // decrement number of posReacts
                if ((oldReact > 1 && newReact < 2) || (oldReact === newReact) ) {
                  firebase
                    .firestore()
                    .collection('Feeds')
                    .doc(friendUid)
                    .collection('Likes')
                    .doc(memeId)
                    .update({
                      posReacts: posReacts-1,
                      // remove this user as someone that liked this meme
                      likers:
                        firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
                    });
                  }
              } else {
                // doc doesn't exist
                // only make it exist if its a positive react
                if (newReact > 1) {
                  firebase
                    .firestore()
                    .collection('Feeds')
                    .doc(friendUid)
                    .collection('Likes')
                    .doc(memeId)
                    .set({
                      posReacts: 1,
                      time: date,
                      url: this.props.imageUrl,
                      likedFrom: this.props.postedBy,
                      // add this user as someone that liked this meme
                      likers: [firebase.auth().currentUser.uid]
                    });
                }
              }
            });
          }
        });
  };

  handleCommentClick() {
    this.props.navigation.navigate('Comment', {
      memeId: this.props.memeId,
      uri: this.props.imageUrl,
    });
  }

  _renderItem = (data) => {
    <TouchableOpacity
      style={{
        width: 25,
        height: 25,
      }}
      onPress={this._onPressButton}
    >
      <Image
        resizeMode="cover"
        style={{ flex: 1 }}
        source={{ uri: this.emojiRank[data] }}
      />
    </TouchableOpacity>;
  };

  _renderPlaceholder = (i) => <View style={styles.item} key={i} />;

  render() {
    return (
      <View style={styles.buttonBar}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'flex-start',
          }}
          onPress={() => {
            this.handleCommentClick();
          }}
        >
          <Image
            style={styles.button1}
            source={require('../../images/Tile/chatLogo2.png')}
          />
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity onPress={this._onPressButton.bind(this, 0)}>
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={
                this.state.selectedButton === 0 ||
                this.state.selectedButton === null
                  ? require('../../images/Tile/button0.png')
                  : require('../../images/Tile/button0Fade.png')
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            // style={{
            //   width: 35,
            //   height: 35,
            // }}
            onPress={this._onPressButton.bind(this, 1)}
          >
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={
                this.state.selectedButton === 1 ||
                this.state.selectedButton === null
                  ? require('../../images/Tile/button1.png')
                  : require('../../images/Tile/button1Fade.png')
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity onPress={this._onPressButton.bind(this, 2)}>
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={
                this.state.selectedButton === 2 ||
                this.state.selectedButton === null
                  ? require('../../images/Tile/button2.png')
                  : require('../../images/Tile/button2Fade.png')
              }
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity onPress={this._onPressButton.bind(this, 3)}>
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={
                this.state.selectedButton === 3 ||
                this.state.selectedButton === null
                  ? require('../../images/Tile/button3.png')
                  : require('../../images/Tile/button3Fade.png')
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
            }}
            // this.resPress.bind(this,yourData)
            onPress={this._onPressButton.bind(this, 4)}
          >
            <Image
              resizeMode="cover"
              style={{ height: 34, width: 34 }}
              source={
                this.state.selectedButton === 4 ||
                this.state.selectedButton === null
                  ? require('../../images/Tile/button4.png')
                  : require('../../images/Tile/button4Fade.png')
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button1: {
    width: 30,
    height: 32,
    marginLeft: '20%',
    marginTop: '3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withNavigation(ButtonBar);
