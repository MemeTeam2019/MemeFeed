import * as React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Text,
  Button,
  Dimensions
} from 'react-native';

import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';


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
      filename: '',
      imageuri: '',
      isChosen: false,
      isUploaded: false,
    };
  }

  
  handlePhoto = () => {
    const options = {
      noData: true
    };
    ImagePicker.launchImageLibrary(options, (response)=>{
      if(response.uri){
        this.setState({ imageuri: response.uri,
                        filename: response.filename,
                        isChosen: true
        });

      }
    });
  }
  handleUpload = () => {
    const storRef = firebase.storage().ref('meme_images').child(firebase.auth().currentUser.uid+this.state.filename);
    storRef.putFile(this.state.imageuri);
    storRef.getDownloadURL() .then((newurl) => {

    const reactRef = firebase.firestore().collection('Memes');
    var data = {
    filename: this.state.filename,
    url: newurl,
    author: firebase.auth().currentUser.uid,
    sub: 'MemeFeed',
    time: Math.round(+new Date() / 1000),
    score: 0,
    caption: '',
    reacts: 0
  };
  reactRef.add(data);
  this.setState({
    isChosen: false,
  });
  const proRef = firebase.firestore().collection('Reacts').doc(firebase.auth().currentUser.uid).collection('Likes');
    var data2 = {
      rank: 4,
      time: Math.round(+new Date() / 1000),
      url: newurl,
      likeFrom: 'MemeFeed',
    };
    proRef.add(data2);
    });
      
  }

  render() {
    if(this.state.isChosen==false&&this.state.isUploaded==false){
      //choose the photo
    return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <Text style={styles.textSty4}>
              Upload
            </Text>
          </View>
          <View style={styles.container3}>
          <View style={styles.containerStyle2}>
            <Image
              source={require('../images/image.png.gif')}
              style={styles.tile}
              />
          </View>
          <View style={styles.container}>
            <TouchableOpacity onPress={this.handlePhoto}>
              <Text style={styles.button}>Open Library</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
        
      );
  }
  if(this.state.isChosen==true&&this.state.isUploaded==false){
    //photo is chosen and not uploaded
    var uri = this.state.imageuri;
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
            <Text style={styles.textSty4}>
              Upload
            </Text>
          </View>
          <View style={styles.containerStyle2}>
            <AutoHeightImage
              source={{uri}}
              width={Dimensions.get("window").width}
            />
          </View>
          <View style={styles.container}>
              <View style={styles.leftContainer}>
                <TouchableOpacity>
                  <Text style={styles.button2}>Retake</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rightContainer}>
                <TouchableOpacity onPress={this.handleUpload}> 
                  <Text style={styles.button2}>Post</Text>
                </TouchableOpacity>
              </View>
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
              Upload
            </Text>
          </View>
          <View style={styles.containerStyle2}>
            <Image
              source={require('../images/image.png.gif')}
              style={styles.tile}
            />
          <TouchableOpacity onPress={this.handlePhoto}>
            <Text style={styles.button}>Open Library</Text>
          </TouchableOpacity>
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
    borderBottomWidth: 0.5,
    borderColor: '#D6D6D6'
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
  },
  containerStyle2: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tile: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 50
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
  button: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',

  },
  button2: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: '20%'
  },
  leftContainer: {
    justifyContent: 'flex-start',
    paddingLeft: '5%', 
    width: Dimensions.get('screen').width * 0.5 

  },
  rightContainer: {
    justifyContent: 'flex-end',
    paddingLeft: '18%',
    width: Dimensions.get('screen').width * 0.5 
  },
  post: {
    width: 50,
    height: 50
  }
});

