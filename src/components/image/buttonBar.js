/* eslint-disable no-loop-func */
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

  componentDidMount() {
    const user = firebase.auth().currentUser;
    const memeId = this.props.memeId;
    firebase
      .firestore()
      .collection('Reacts')
      .doc(user.uid)
      .collection('Likes')
      .doc(memeId)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          const data = docSnapshot.data();
          const rank = data.rank;
          this.setState({ selectedButton: rank === -1 ? null : rank });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this.unsubscribe = null;
  }

  _onPressButton = async (newReact) => {
    const oldReact = this.state.selectedButton;
    const user = firebase.auth().currentUser;
    const memeId = this.props.memeId;
    const date = Math.round(+new Date() / 1000);
    if (oldReact === null) {
      const noteRef = firebase
        .firestore()
        .collection('Notifications')
        .doc(this.props.postedBy)
        .collection('Notes');
      noteRef.add({
        type: 'like',
        uid: user.uid,
        time: date,
        memeId: memeId,
        viewed: false,
      });
    }

    // Update the Reacts collection for current uid
    const reactRef = firebase
      .firestore()
      .collection('Reacts')
      .doc(user.uid)
      .collection('Likes')
      .doc(memeId);
    const memeRef = firebase
      .firestore()
      .collection('MemesTest')
      .doc(memeId);

    reactRef.get().then((likesSnapshot) => {
      const data = likesSnapshot.data();
      const hasReacted = likesSnapshot.exists && data.rank !== -1;

      reactRef.set({
        rank: oldReact === newReact ? -1 : newReact,
        time: date,
        url: this.props.imageUrl,
        likedFrom: this.props.postedBy,
        caption: this.props.caption,
      });
      memeRef
        .get()
        .then(async (memeSnapshot) => {
          if (memeSnapshot.exists) {
            const memeData = memeSnapshot.data();
            let newReactCount = 0;
            if (!hasReacted) {
              newReactCount = memeData.reactCount + 1 || 1;
            } else if (hasReacted && oldReact === newReact) {
              newReactCount = memeData.reactCount - 1;
            } else {
              newReactCount = memeData.reactCount;
            }

            let positiveWeight = memeData.positiveWeight || 0;
            let negativeWeight = memeData.negativeWeight || 0;

            if (newReact > 1) {
              positiveWeight = positiveWeight + newReact + 1;
            } else {
              negativeWeight = negativeWeight + newReact + 1;
            }

            if (oldReact != null) {
              if (oldReact > 1) {
                positiveWeight = positiveWeight - oldReact - 1;
              } else {
                negativeWeight = negativeWeight - oldReact - 1;
              }
            }

            if (oldReact === newReact) {
              if (newReact > 1) {
                positiveWeight = positiveWeight - oldReact - 1;
              } else {
                negativeWeight = negativeWeight - oldReact - 1;
              }
            }

            this.props.updateReacts(newReactCount);
            memeRef.update({
              positiveWeight,
              negativeWeight,
              reactCount: newReactCount,
              lastReacted: date,
            });

            const subredditRef = firebase
              .firestore()
              .collection('SubredditVectors')
              .doc(memeData.sub);
            subredditRef.get().then((snapshot) => {
              if (!snapshot.exists) {
                subredditRef.set({
                  positiveWeight: newReact > 1 ? newReact : 0,
                  negativeWeight: newReact < 2 ? newReact : 0,
                  lastReacted: date,
                });
              } else {
                const subredditData = snapshot.data();
                let posWeight = subredditData.positiveWeight;
                let negWeight = subredditData.negativeWeight;

                if (newReact > 1) {
                  posWeight = posWeight + newReact + 1;
                } else {
                  negWeight = negWeight + newReact + 1;
                }

                if (oldReact != null) {
                  if (oldReact > 1) {
                    posWeight = posWeight - oldReact - 1;
                  } else {
                    negWeight = negWeight - oldReact - 1;
                  }
                }

                if (oldReact === newReact) {
                  if (newReact > 1) {
                    posWeight = posWeight - oldReact - 1;
                  } else {
                    negWeight = negWeight - oldReact - 1;
                  }
                }

                subredditRef.update({
                  positiveWeight: posWeight,
                  negativeWeight: negWeight,
                  lastReacted: date,
                });
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });

    this.setState({
      selectedButton: newReact === oldReact ? null : newReact,
    });

    // grab this users follower list
    // go through each follower,and get that f_uid
    // add to the collection Feeds/f_uid and add that react
    firebase
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
                const { posReacts, time } = doc.data();
                // originally did not like the meme but now does
                // or first time liking the meme and ranking it highly
                // then add to the total number of positive votes
                const newPosReacts = posReacts + 1;
                if (
                  (oldReact < 2 && newReact > 1 && oldReact != newReact) ||
                  (oldReact === null && newReact > 1)
                ) {
                  firebase
                    .firestore()
                    .collection('Feeds')
                    .doc(friendUid)
                    .collection('Likes')
                    .doc(memeId)
                    .update({
                      posReacts: newPosReacts,
                      time: date,
                      // add this user as someone that liked this meme
                      likers: firebase.firestore.FieldValue.arrayUnion(
                        firebase.auth().currentUser.uid
                      ),
                      likedFrom: firebase.firestore.FieldValue.arrayUnion(
                        this.props.postedBy
                      ),
                    });
                }

                // originally liked the meme, but now does not
                // OR unreacting to meme
                // decrement number of posReacts
                if ((oldReact > 1 && newReact < 2) || oldReact === newReact) {
                  var newTime = time;
                  if (newPosReacts < 1) {
                    newTime = 0;
                  }
                  firebase
                    .firestore()
                    .collection('Feeds')
                    .doc(friendUid)
                    .collection('Likes')
                    .doc(memeId)
                    .update({
                      posReacts: posReacts - 1,
                      time: newTime,
                      // remove this user as someone that liked this meme
                      likers: firebase.firestore.FieldValue.arrayRemove(
                        firebase.auth().currentUser.uid
                      ),
                      likedFrom: firebase.firestore.FieldValue.arrayRemove(
                        this.props.postedBy
                      ),
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
                      // add this user as someone that liked this meme
                      likers: [firebase.auth().currentUser.uid],
                      likedFrom: [this.props.postedBy],
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
        resizeMode='cover'
        style={{ flex: 1 }}
        source={{ uri: this.emojiRank[data] }}
      />
    </TouchableOpacity>;
  };

  _renderPlaceholder = (i) => <View style={styles.item} key={i} />;

  render() {
    return (
      <View style={styles.buttonBar}>
        <View style={styles.button}>
          <TouchableOpacity onPress={this._onPressButton.bind(this, 0)}>
            <Image
              resizeMode='cover'
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
          <TouchableOpacity onPress={this._onPressButton.bind(this, 1)}>
            <Image
              resizeMode='cover'
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
              resizeMode='cover'
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
              resizeMode='cover'
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
          <TouchableOpacity onPress={this._onPressButton.bind(this, 4)}>
            <Image
              resizeMode='cover'
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: '35%',
  },
  button: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withNavigation(ButtonBar);
