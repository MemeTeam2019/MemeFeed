import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
 
import Grid from 'react-native-grid-component';
 
class ButtonBar extends React.Component {
  _onPressButton = () => {
        Alert.alert("reaction noticed")
  }



  _renderItem = (data, i) => (
    // <View  
    //   style={[{ backgroundColor: 'rgba(255,255,255,1)' }, styles.item]} 
    //   key={i} 
    // >

    //   <Image
    //     source={{uri: 'https://www.clipartmax.com/png/middle/25-258609_emoji-fire-flame-clip-art-fire-emoji.png'}}
    //   />


    // </View>

    <View  
      style={[{ backgroundColor: 'rgba(255,255,255,1)' }, styles.item]} 
      key={i} 
    >
       <Button
         onPress={this._onPressButton}
         title={data}
        />
    </View>
  );



  // _renderItem = (data, i) => (
  //   <View  
  //     style={[{ backgroundColor: 'rgba(255,255,255,1)' }, styles.item]} 
  //     key={i} 
  //   >
  //     // // <TouchableOpacity onPress={this._onPressButton}>
  //     //   <Image
  //     //     source={{uri: 'https://www.clipartmax.com/png/middle/25-258609_emoji-fire-flame-clip-art-fire-emoji.png'}}
  //     //   />
  //     // // </TouchableOpacity>

  //   </View>
  // );



  // _renderItem = (data, i) => (
  //   <View  
  //     style={[{ backgroundColor: 'rgba(255,255,255,1)' }, styles.item]} 
  //     key={i} 
  //   >

  //   <TouchableOpacity 
  //     style={[{ backgroundColor: 'rgba(0,20,25,1)'}]}
  //     onPress={this._onPressButton}>
  //     <Image
  //       style={styles.button}
  //       source='https://www.clipartmax.com/png/middle/25-258609_emoji-fire-flame-clip-art-fire-emoji.png'
  //     />
  //   </TouchableOpacity>


  //   </View>

  //   // <View  
  //   //   style={[{ backgroundColor: 'rgba(255,255,255,1)' }, styles.item]} 
  //   //   key={i} 
  //   // >
  //   //    <Button
  //   //      onPress={this._onPressButton}
  //   //      title="Press Me"
  //   //     />
  //   // </View>
  // );
 
  _renderPlaceholder = i => <View style={styles.item} key={i} />;
 
  render() {
    return (

      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={['0','1','2','3','4']}
        itemsPerRow={5}
      />
    );
  }
}


export default ButtonBar; 
 
const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 40,
    margin: 1,
  },
  list: {
    flex: 1,
    top: 800,
    right: 9,
    position: 'absolute',

  }
});
