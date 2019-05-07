import * as React from 'react';
import {
  Alert,
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  Button,
  Dimensions
} from 'react-native';
import firebase from 'react-native-firebase';
// import vision from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';


// import vision from 'react-native-firebase';


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
      modalVisible: false,
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

  handleUpload = async () => {
    console.log('HANDLE UPLOAD START====')
    Alert.alert('Upload Error', 'This image was flagged for showing NSFW content, which goes against our policy. If you think this was a mistake email us at: memefeedaye@gmail.com', [
      { text: 'OK' },
    ]);

    try {
    		let body = JSON.stringify({
    			requests: [
    				{
    					features: [
    						{ type: 'LABEL_DETECTION', maxResults: 10 },
    						{ type: 'LANDMARK_DETECTION', maxResults: 5 },
    						{ type: 'FACE_DETECTION', maxResults: 5 },
    						{ type: 'LOGO_DETECTION', maxResults: 5 },
    						{ type: 'TEXT_DETECTION', maxResults: 5 },
    						{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
    						{ type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
    						{ type: 'IMAGE_PROPERTIES', maxResults: 5 },
    						{ type: 'CROP_HINTS', maxResults: 5 },
    						{ type: 'WEB_DETECTION', maxResults: 5 }
    					],
    					image: {
    						source: {
    							imageUri:'https://news.nationalgeographic.com/content/dam/news/2018/05/17/you-can-train-your-cat/02-cat-training-NationalGeographic_1484324.ngsversion.1526587209178.adapt.1900.1.jpg'

    						}
    					}
    				}
    			]
    		});
    		let response = await fetch(
    			'POST https://vision.googleapis.com/v1/images:annotate?key=9eca8f28946de6a135f7dbaff8a85455efd95460',
    			{
    				headers: {
    					Accept: 'application/json',
    					'Content-Type': 'application/json'
    				},
    				method: 'POST',
    				body: body
    			}
    		);
    		let responseJson = await response.json();
        Alert.alert('Upload Error', 'got das respomse : )', [
          { text: 'OK' },
        ]);
    		console.log(responseJson);
    	} catch (error) {
    		console.log(error);
        Alert.alert('Upload Error', 'no response : (', [
          { text: 'OK' },
        ]);
    	}

    console.log('HANDLE UPLOAD END===')
  }


  // handleUpload = () => {
  //   const storRef = firebase.storage().ref('meme_images').child(firebase.auth().currentUser.uid+this.state.filename);
  //   storRef.putFile(this.state.imageuri);
  //   storRef.getDownloadURL() .then((newurl) => {
  //
  //   const reactRef = firebase.firestore().collection('Memes');
  //   var data = {
  //   filename: this.state.filename,
  //   url: newurl,
  //   author: firebase.auth().currentUser.uid,
  //   sub: 'MemeFeed',
  //   time: Math.round(+new Date() / 1000),
  //   score: 0,
  //   caption: '',
  //   reacts: 0
  // };
  // reactRef.add(data);
  // this.setState({
  //   isChosen: false,
  // });
  // const proRef = firebase.firestore().collection('Reacts').doc(firebase.auth().currentUser.uid).collection('Likes');
  //   var data2 = {
  //     rank: 4,
  //     time: Math.round(+new Date() / 1000),
  //     url: newurl,
  //     likeFrom: 'MemeFeed',
  //   };
  //   proRef.add(data2);
  //   });
  //
  // }

  render() {
    const optionArray = ['okau'];
    const title='This image was flagged for showing NSFW content, which goes against our policy. If you think this was a mistake email us at: memefeedaye@gmail.com'

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
            <Image
              source={{uri}}
              style={styles.tile}
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
                  <Image
                    source={require('../images/post.png')}
                    style = {styles.post}
                  />
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
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Bold',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
  },
  containerStyle2: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '2%',
    paddingRight: '2%',
  },
  container3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tile: {
    width: Dimensions.get('screen').width * 0.85,
    height: Dimensions.get('screen').width * 0.85,
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
    fontFamily: 'Avenir Next',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',

  },
  button2: {
    fontFamily: 'Avenir Next',
    fontSize: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 6
  },
  leftContainer: {
    justifyContent: 'flex-start',
    marginLeft: '10%'

  },
  rightContainer: {
    justifyContent: 'flex-end',
    marginLeft: '55%'

  },
  post: {
    width: 50,
    height: 50
  }
});
