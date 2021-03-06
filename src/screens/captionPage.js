import * as React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Button,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import firebase from 'react-native-firebase';
import { TextInput } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import AutoHeightImage from 'react-native-auto-height-image';


/**
 * Screen from which users can upload photos
 *
 * Used by:
 *     mainNavigator.js
 *
 * Props:
 *     None
 */



class CaptionPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Upload',
      headerTitleStyle: {
        fontSize: 20,
        fontFamily: 'Avenir Next',
        fontWeight: 'normal',
      },
      headerLeft: (
        <Button onPress={navigation.getParam('back')} title=' Back' />
      ),
      headerRight: (
        <Button onPress={navigation.getParam('upload')} title='Post  ' />
      ),
    };
  };

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.unsubscribe = null;
    this.state = {
      isUploading: false,
      api_key: '',
      filename: this.props.navigation.getParam('filename', ''),
      imageuri: this.props.navigation.getParam('imageuri', ''),
      caption: '',
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe = null;
  }

  // this gets the api key from the server
  componentDidMount() {
    //console.log('mouning hnnng')
    this.pickPhoto()
    this.props.navigation.setParams({ upload: this.handleUpload });
    this.props.navigation.setParams({ back: this.pickPhoto });
    this._isMounted = true;
    if (this._isMounted) {
      this.unsubscribe = firebase
        .firestore()
        .collection('Secrets')
        .doc('key')
        .get()
        .then((doc) => {
          const { api } = doc.data();
          this.setState({ api_key: api });
        })
        .catch((err) => {
          console.log('Error getting document', err);
        });
    }
  }
//opens library for user to pick
  pickPhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({
          imageuri: response.uri,
          filename: response.filename,
          isChosen: true,
          caption: '',
        });
      }
      if (response.didCancel) {
        this.props.navigation.popToTop();
        this.props.navigation.navigate('Profile', {
          uid: firebase.auth().currentUser.uid,
        });
        this.componentWillUnmount();
      }
    });
  };

  handleUpload = async () => {
    this.setState({ isUploading: true });

    if (!this.state.imageuri) {
      this.setState({ isUploading: false });
      Alert.alert('Upload Failed', 'Please try again :(');
      return;
    }

    if (this.state.caption === '') {
      this.setState({ isUploading: false });
      Alert.alert('Empty caption! Say something about your meme :)');
      return;
    }

    const docId =
      firebase.auth().currentUser.uid + Math.round(+new Date() / 1000);
    const storRef = firebase
      .storage()
      .ref('meme_images_TEST')
      .child(docId);
    await storRef.putFile(this.state.imageuri);

    storRef.getDownloadURL().then(async (newurl) => {
      try {
        let body = JSON.stringify({
          requests: [
            {
              features: [{ type: 'SAFE_SEARCH_DETECTION', maxResults: 5 }],
              image: {
                source: {
                  imageUri: newurl,
                },
              },
            },
          ],
        });
        let response = await fetch(
          'https://vision.googleapis.com/v1/images:annotate?key=' +
            this.state.api_key,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: body,
          }
        );
        let responseJson = await response.json();
        console.log(responseJson);
        console.log(responseJson.responses[0]['safeSearchAnnotation']['adult']);
        let isNSFW = responseJson.responses[0]['safeSearchAnnotation']['adult'];
        // if image is nsfw don't post
        if (isNSFW === 'VERY_LIKELY' || isNSFW === 'LIKELY') {
          this.setState({ isUploading: false });
          Alert.alert(
            'Upload Error',
            'This image was flagged for showing NSFW content, which goes against our policy. If you think this was a mistake email us at: memefeedaye@gmail.com',
            [{ text: 'OK' }]
          );
        } else {
          // image is okay to post
          // post in Memes and use the doc id it creates elsewhere
          const memeCollection = firebase
            .firestore()
            .collection('Memes')
            .doc(docId);
          memeCollection.set({
            url: newurl,
            author: firebase.auth().currentUser.uid,
            sub: '',
            time: Math.round(+new Date() / 1000),
            score: 0,
            caption: this.state.caption,
            reacts: 1,
          });
          // .then(function(meme) {
          console.log('Document written with ID: ', docId);

          // post in this users reacts
          firebase
            .firestore()
            .collection('Reacts')
            .doc(firebase.auth().currentUser.uid)
            .collection('Likes')
            .doc(docId)
            .set({
              rank: 4,
              time: Math.round(+new Date() / 1000),
              url: newurl,
              likeFrom: firebase.auth().currentUser.uid,
              caption: this.state.caption,
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
              let i;
              for (i = 0; i < followersLst.length; ++i) {
                // grab friend uid
                const friendUid = followersLst[i];
                firebase
                  .firestore()
                  .collection('Feeds')
                  .doc(friendUid)
                  .collection('Likes')
                  .doc(docId)
                  .set({
                    posReacts: 1,
                    time: Math.round(+new Date() / 1000),
                    url: newurl,
                    caption: this.state.caption,
                    // add this user as someone that liked this meme
                    likers: [firebase.auth().currentUser.uid],
                    likedFrom: [firebase.auth().currentUser.uid],
                  });
              }
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
              for (let i = 0; i < followersLst.length; i += 1) {
                // grab friend uid
                const friendUid = followersLst[i];
                firebase
                  .firestore()
                  .collection('Feeds')
                  .doc(friendUid)
                  .collection('Likes')
                  .doc(docId)
                  .set({
                    posReacts: 1,
                    time: Math.round(+new Date() / 1000),
                    url: newurl,
                    caption: this.state.caption,
                    // add this user as someone that liked this meme
                    likers: [firebase.auth().currentUser.uid],
                    likedFrom: [firebase.auth().currentUser.uid],
                  });
              }
            });

          // if safe for work, then after being posted this our users Reacts
          // navigate to their profile,

          this.props.navigation.popToTop();
          this.props.navigation.navigate('Profile', {
            uid: firebase.auth().currentUser.uid,
          });
          this.setState({ isUploading: false });
        }
      } catch (error) {
        this.setState({ isUploading: false });
        console.log(error);
      }
    });
  };

  render() {
    return (
      <View>
      { this.state.isUploading &&
        <View 
        style={{justifyContent: 'center', alignItems: 'center', marginTop: '50%',}}
        >          
          <ActivityIndicator
            color = "#5B5B5B"
            size = "large"
          />
          <Text 
          style={{fontSize: 1000 }}>
            
          </Text>
          <Text 
          style={{color:"#5B5B5B", fontSize: 20,}}>
            Uploading Meme
          </Text>
        </View>
      }
      { !this.state.isUploading &&
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={Dimensions.get('window').height * 0.12}
        >
          <View>
            <NavigationEvents
              onDidFocus={() => {
                this.setState(
                  {
                    isChosen: false,
                    caption: '',
                    imageuri: '',
                  },
                  () => this.pickPhoto()
                );
              }}
            />
            <ScrollView
              ref={(ref) => {
                this.scrollView = ref;
              }}
            >
              <View style={styles.conatiner}>
                <AutoHeightImage
                  style={styles.image}
                  source={{ uri: this.state.imageuri }}
                  width={Dimensions.get('window').width}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Enter a Caption'
                  onChangeText={(caption) => this.setState({ caption })}
                  autoCapitalize='none'
                  multiline
                  value={this.state.caption}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      }
      </View>
    );
  }
}

export default CaptionPage;

const styles = StyleSheet.create({
  conatiner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBar: {
    height: '15%',
    paddingTop: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: '#D6D6D6',
  },
  input: {
    width: Dimensions.get('screen').width * 0.95,
    height: 60,
    borderRadius: 10,
    fontSize: 18,
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#efefef',
    marginHorizontal: '2.5%',
    marginTop: '10%',
  },
  postButton: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 20,
    marginTop: '8%',
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
});
