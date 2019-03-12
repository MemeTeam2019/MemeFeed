import React from 'react';
import { Button, StyleSheet, View, Image, Text, TouchableOpacity, Modal} from 'react-native';
import firebase from "react-native-firebase";

import PostInfo from "../image/PostInfo"

import { withNavigation } from "react-navigation";


class ButtonBar extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      selectedButton: null,
      userHasReacted: false,
    };
    this.emojiRank= {0: '../../images/Tile/Expressionless.png',
      1:'../../images/Tile/Neutral.png',
      2:'../../images/Tile/SlightlySmiling.png',
      3:'../../images/Tile/BeamingGrin.png',
      4:'../../images/Tile/LaughingTearsOfJoy.png'
    };
    this.UnclickedEmojiRank = {0: '../../images/Tile/ExpressionlessFade.png',
      1:'../../images/Tile/NeutralFade.png',
      2:'../../images/Tile/SlightlySmileFade.png',
      3:'../../images/Tile/BeamingGrinFade.png',
      4:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FLaughingTearsOfJoyFade.png?alt=media&token=d992a83a-ec9a-4bba-9859-60000523fd99'
    };
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
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          let data = docSnapshot.data();
          if (data) {
            let rank = data.rank;
            this.setState({ selectedButton: rank == -1 ? null : rank });
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  _onPressButton = async newReact => {
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

    reactRef.get().then(likesSnapshot => {
      const data = likesSnapshot.data();
      var hasReacted = likesSnapshot.exists && data.rank !== -1;
      console.log('LIKIND DAS MEME MIA ALTIERI')
      console.log(this.props.postedBy)
      reactRef.set({
        rank: oldReact === newReact ? -1 : newReact,
        time: date,
        url: this.props.imageUrl,
        likedFrom: this.props.postedBy,
      });
      memeRef
        .get()
        .then(async memeSnapshot => {
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
        .catch(err => {
          console.log(err);
        });
    });
  }

  handleCommentClick() {
    this.props.navigation.navigate("Comment", {
      memeId: this.props.memeId,
      uri: this.props.imageUrl
    });
  }


  _renderItem = data => {
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

  _renderPlaceholder = i => <View style={styles.item} key={i} />;

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
            }}>
            <Image
              style={styles.button1}
              source={require('../../images/Tile/chatLogo2.png')}
            />
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={this._onPressButton.bind(this,0)}>
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={ this.state.selectedButton === 0 || this.state.selectedButton === null
                ? require('../../images/Tile/Expressionless.png')
                : require('../../images/Tile/ExpressionlessFade.png')
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
            onPress={this._onPressButton.bind(this,1)}>
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={ this.state.selectedButton === 1 || this.state.selectedButton === null
                  ? require('../../images/Tile/Neutral.png')
                  : require('../../images/Tile/NeutralFade.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={this._onPressButton.bind(this,2)}>
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={ this.state.selectedButton === 2 || this.state.selectedButton === null
                  ? require('../../images/Tile/SlightlySmiling.png')
                  : require('../../images/Tile/SlightlySmileFade.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            onPress={this._onPressButton.bind(this,3)}>
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={ this.state.selectedButton === 3 || this.state.selectedButton === null
                  ? require('../../images/Tile/BeamingGrin.png')
                  : require('../../images/Tile/BeamingGrinFade.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.button} >
        <TouchableOpacity
            style={{
              width: 35,
              height: 35,
            }}
            // this.resPress.bind(this,yourData)
            onPress={this._onPressButton.bind(this,4)}>
            <Image
              resizeMode="cover"
              style={{ height: 35, width: 35 }}
              source={ this.state.selectedButton === 4 || this.state.selectedButton === null
                    ? require('../../images/Tile/LaughingTearsOfJoy.png')
                    : this.UnclickedEmojiRank[4]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}



export default withNavigation(ButtonBar);

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center'
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
    justifyContent: 'center'
  },
});
