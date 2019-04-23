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
import ImagePicker from 'react-native-image-picker';


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
    var uri = this.state.imageuri;
      return (
        <View style={styles.containerStyle}>
          <View style={styles.navBar}>
          <Text style={styles.textSty4}>
            Choose Image
          </Text>
          </View>
          <View style={styles.containerStyle2}>
          <Image
            source={{uri}}
            style={styles.tile}
            />
          <Button
            title="Upload"
            onPress={this.handleUpload}
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

