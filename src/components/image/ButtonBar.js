import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import firebase from "react-native-firebase";
 
import Grid from 'react-native-grid-component';
 
class ButtonBar extends React.Component {



  constructor(props) {
    super(props);

    this.state = { selectedButton: null };

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



  _onPressButton = (num) => {
    // Alert.alert(num.toString())
    val = num
    if (num === this.state.selectedButton){
      val = null
    }
    this.setState({ selectedButton: val })

    const user = firebase.auth().currentUser;
    const ref = firebase.firestore().collection("Reacts").doc(user.uid);
    const date = (new Date()).toString();
    const memeId = "dummy";

    ref.get().then(doc => {
      const data = doc.data();
      const oldRank = data[memeId].rank;
      let newRank = -1;
      if (oldRank == num)
        newRank = -1;
      else
        newRank = num;
      ref.set({[memeId]: {
        rank: newRank,
        time: date
      }}, {merge: true});
    })
    .catch(error => console.log(error))
  }


  _renderItem = (data) => (


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

  );


 
  _renderPlaceholder = i => <View style={styles.item} key={i} />;

 
  render() {
    return (

      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{width: 10, height: 50}}>
          
        </View>

        <View style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
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

        <View style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
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

        <View style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
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

        <View style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
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


        <View style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}} >
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

      // <Grid
      //   style={styles.list}
      //   renderItem={this._renderItem}
      //   renderPlaceholder={this._renderPlaceholder}
      //   data={['0','1','2','3','4']}
      //   itemsPerRow={5}
      // />
    );
  }
}


export default ButtonBar; 
 
const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 50,
    margin: 1,
  },
  list: {
    // flex: .5,
    // top: 25,
    // right: 9,
    // position: 'absolute',
  }
});
