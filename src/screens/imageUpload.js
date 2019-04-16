import * as React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Text,
  Button,
  
} from 'react-native';
import firebase from 'react-native-firebase';


/**
 * Screen used for users to upload memes
 * 
 *
 * Used by:
 *     mainNavigator.js
 *
 * Props:
 *     None
 */
class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageuri: '',
      isChosen: false,
      isUploaded: false,
    };
  }
  handlePhoto(){
    //to do
  }
  handleUpload(){
    //to do

  }
  render(){
    if(this.state.isChosen==false&&this.state.isUploaded==false){
      //choose the photo
    return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
          <Text style={styles.textSty4}>
            Choose Image
          </Text>
          </View>
          <View style={styles.containerStyle2}>
          <Image
            source={require('../images/image.png.gif')}
            style={styles.tile}
            />
          <Button
            title="Open Library"
            onPress={this.handlePhoto}
          />
          </View>
        </View>

      );
  }
  if(this.state.isChosen==true&&this.state.isUploaded==false){
    //photo is chosen and not uploaded
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
          <Text style={styles.textSty4}>
            Choose Image
          </Text>
          </View>
          <View style={styles.containerStyle2}>
          <Image
            source={require('../images/image.png.gif')}
            style={styles.tile}
            />
          <Button
            title="Open Library"
            onPress={this.handlePhoto}
          />
          </View>
        </View>

      );
  }
  if(this.state.isChosen==true&&this.state.isUploaded==true){
      //photo is set
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
          <Text style={styles.textSty4}>
            Choose Image
          </Text>
          </View>
          <View style={styles.containerStyle2}>
          <Image
            source={require('../images/image.png.gif')}
            style={styles.tile}
            />
          <Button
            title="Open Library"
            onPress={this.handlePhoto}
          />
          </View>
        </View>

      );
  }
  }
}

export default ImageUpload;
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
    navBar: {
    height: 95,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue-Bold',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
   containerStyle2: {
    flex: 2,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  tile: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    alignItems: 'center',
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
});

