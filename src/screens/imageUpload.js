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
    // first create URL

    console.log(process.env.REACT_APP_API_KEY)
    const API_KEY = process.env.REACT_APP_API_KEY

    const storRef = firebase.storage().ref('meme_images').child(firebase.auth().currentUser.uid+this.state.filename);
    storRef.putFile(this.state.imageuri);

    storRef.getDownloadURL().then(async (newurl) => {
      try {
      		let body = JSON.stringify({
      			requests: [
      				{
      					features: [
      						{ type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
      					],
      					image: {
      						source: {
      							imageUri: newurl,
      						}
      					}
      				}
      			]
      		});
      		let response = await fetch(
      			'https://vision.googleapis.com/v1/images:annotate?key='+API_KEY,
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
          console.log(responseJson)
          console.log(responseJson.responses[0]['safeSearchAnnotation']['adult']);
          let isNSFW = responseJson.responses[0]['safeSearchAnnotation']['adult'];
          // if image is nsfw don't post
          if(isNSFW === 'VERY_LIKELY' || isNSFW === 'LIKELY') {
            Alert.alert('Upload Error', 'This image was flagged for showing NSFW content, which goes against our policy. If you think this was a mistake email us at: memefeedaye@gmail.com', [
              { text: 'OK' },
            ]);
          } else {
            // image is okay to post
            // post in Memes and use the doc id it creates elsewhere
            const memeCollection = firebase.firestore().collection('MemesTest');
            memeCollection.add({
              url: newurl,
              author: firebase.auth().currentUser.uid,
              sub: '',
              time: Math.round(+new Date() / 1000),
              score: 0,
              caption: '',
              reacts: 0
            })
            .then(function(meme) {
                console.log("Document written with ID: ", meme.id);

                // post in this users reacts
                const userReactsRef = firebase
                  .firestore()
                  .collection('ReactsTest')
                  .doc(firebase.auth().currentUser.uid)
                  .collection('Likes')
                  .doc(meme.id).set({
                    rank: 4,
                    time: Math.round(+new Date() / 1000),
                    url: newurl,
                    likeFrom: firebase.auth().currentUser.uid,
                  });

                // put meme in their followers feeds
                this.unsubscribe = firebase
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
                        .collection('FeedsTest')
                        .doc(friendUid)
                        .collection('Likes')
                        .doc(meme.id)
                        .set({
                          posReacts: 1,
                          time: Math.round(+new Date() / 1000),
                          url: newurl,
                          // add this user as someone that liked this meme
                          likers: [firebase.auth().currentUser.uid],
                          likedFrom: [firebase.auth().currentUser.uid],
                        });
                    }
                });
            });
          }
          this.setState({
            isChosen: false,
          });

      	} catch (error) {
      		console.log(error);
      	}
      });
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
