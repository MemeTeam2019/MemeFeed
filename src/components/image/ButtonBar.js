import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import firebase from "react-native-firebase";
 
class ButtonBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedButton: null,
      userHasReacted: false
    };
    this.emojiRank= {0: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FExpressionless.png?alt=media&token=b53082db-03bd-4fad-9322-d0827253eee1',
      1:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FNuetral.png?alt=media&token=c9f280e5-a6a8-4f29-ab83-1171b76eac45',
      2:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FSlightlySmiling.png?alt=media&token=4daf97e4-0b31-4e79-8866-07a3c8bf4ba8',
      3:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FBeamingGrin.png?alt=media&token=5d935569-352a-4bf2-b637-63ef8ad0c2d2',
      4:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FLaughingTearsOfJoy.png?alt=media&token=e10f32c5-6e0e-401a-aab1-8d4ee6c3b72c'
    };
    this.UnclickedEmojiRank = {0: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FExpressionlessFade.png?alt=media&token=d457c087-e638-4f5b-b77e-ad3b0a3b362c',
      1:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FNuetralFade.png?alt=media&token=a002b01e-9f47-4601-90d9-5d981eeecea2',
      2:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FSlightlySmileFade.png?alt=media&token=fd66c2bf-a68c-4095-b6ee-e48b7642a55a',
      3:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FBeamingGrinFade.png?alt=media&token=c27709fc-3395-4619-ae3e-09a651935c4b',
      4:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FLaughingTearsOfJoyFade.png?alt=media&token=d992a83a-ec9a-4bba-9859-60000523fd99'
    };  
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    const memeId = this.props.memeId;
    const ref = firebase.firestore().collection("Reacts").doc(user.uid)
                  .collection("Likes").doc(memeId);

    ref.get().then(docSnapshot => {
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
    })
  }


  _onPressButton = async (newReact) => {
    const oldReact = this.state.selectedButton;
    this.setState({
      selectedButton: newReact === oldReact ? null : newReact
    })

    const user = firebase.auth().currentUser;
    const memeId = this.props.memeId;

    // Update the Reacts collection for current uid
    const reactRef = firebase.firestore().collection("Reacts").doc(user.uid)
                      .collection("Likes").doc(memeId);
    const memeRef = firebase.firestore().collection("Memes").doc(memeId);
    const date = Math.round(+new Date()/1000);
    
    reactRef.get().then(likesSnapshot => {
      const data = likesSnapshot.data();
      var hasReacted = likesSnapshot.exists && data.rank !== -1;
      reactRef.set({
        rank: oldReact === newReact ? -1 : newReact,
        time: date
      });
      memeRef.get().then(async memeSnapshot => {
        const data = memeSnapshot.data();
        let newReactCount = 0;
        console.log(hasReacted);
        if (!hasReacted) {
          newReactCount = data.reactCount + 1;
        } else if (hasReacted && oldReact === newReact) {
          newReactCount = data.reactCount - 1;
        } else {
          newReactCount = data.reactCount;
        }
        memeRef.update({ reactCount: newReactCount });
      })
    });


  }


  _renderItem = (data) => {
      <TouchableOpacity
        style={{
          width: 25,
          height: 25,
        }}
        onPress={this._onPressButton}>
        <Image
          resizeMode="cover"
          style={{ flex: 1 }}
          source={{ uri: this.emojiRank[data]}}
        />
      </TouchableOpacity>
  }

  _renderPlaceholder = i => <View style={styles.item} key={i} />;
 
  render() {
    return (

      <View style={styles.buttonBar}>
        <View style={styles.button}>
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
            }}
            onPress={this._onPressButton.bind(this,0)}>
            <Image
              resizeMode="cover"
              style={{ flex: 1 }}
              source={{ uri: 
                this.state.selectedButton === 0 || this.state.selectedButton === null
                  ? this.emojiRank[0]
                  : this.UnclickedEmojiRank[0]}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
            }}
            onPress={this._onPressButton.bind(this,1)}>
            <Image
              resizeMode="cover"
              style={{ flex: 1 }}
              source={{ uri: 
                this.state.selectedButton === 1 || this.state.selectedButton === null
                  ? this.emojiRank[1]
                  : this.UnclickedEmojiRank[1]}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
            }}
            onPress={this._onPressButton.bind(this,2)}>
            <Image
              resizeMode="cover"
              style={{ flex: 1 }}
              source={{ uri: 
                this.state.selectedButton === 2 || this.state.selectedButton === null
                  ? this.emojiRank[2]
                  : this.UnclickedEmojiRank[2]}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
            }}
            onPress={this._onPressButton.bind(this,3)}>
            <Image
              resizeMode="cover"
              style={{ flex: 1 }}
              source={{ uri: 
                this.state.selectedButton === 3 || this.state.selectedButton === null
                  ? this.emojiRank[3]
                  : this.UnclickedEmojiRank[3]}}
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
              style={{ flex: 1 }}
              source={{ uri: 
                this.state.selectedButton === 4 || this.state.selectedButton === null
                                ? this.emojiRank[4]
                                : this.UnclickedEmojiRank[4]}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ButtonBar; 
 
const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'center'
  },
  button: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
