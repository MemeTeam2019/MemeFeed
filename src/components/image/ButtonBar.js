import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
 
import Grid from 'react-native-grid-component';
 
class ButtonBar extends React.Component {



  constructor(props) {
    super(props);
    this.emojiRank= {0: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FExpressionless.png?alt=media&token=b53082db-03bd-4fad-9322-d0827253eee1',
      1:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FNuetral.png?alt=media&token=c9f280e5-a6a8-4f29-ab83-1171b76eac45',
      2:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FSlightlySmiling.png?alt=media&token=4daf97e4-0b31-4e79-8866-07a3c8bf4ba8',
      3:'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/ImagesForApplicationDesign%2FBeamingGrin.png?alt=media&token=5d935569-352a-4bf2-b637-63ef8ad0c2d2',
      4: 'https://ih1.redbubble.net/image.427647232.7122/st%2Csmall%2C215x235-pad%2C210x230%2Cf8f8f8.lite-1.jpg'};
  }



  _onPressButton = () => {
    Alert.alert("button pressed")
  }


  _renderItem = (data, i) => (

      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
        }}
        onPress={this._onPressButton}>
        <Image
          resizeMode="cover"
          style={{ flex: 1 }}
          source={{ uri: this.emojiRank[data]}}//'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'}}
        />
      </TouchableOpacity>


    // <View  
    //   style={[{ backgroundColor: 'rgba(255,255,255,1)' }, styles.item]} 
    //   key={i} 
    // >



    //    <Button
    //      onPress={this._onPressButton}
    //      title={data}
    //     />
    // </View>
  );


 
  _renderPlaceholder = i => <View style={styles.item} key={i} />;
 
  render() {
    return (

      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={['4','3','2','1','0']}
        itemsPerRow={5}
      />
    );
  }
}


export default ButtonBar; 
 
const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 30,
    margin: 1,
  },
  list: {
    flex: 1,
    top: 800,
    right: 9,
    position: 'absolute',

  }
});
