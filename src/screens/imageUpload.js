import * as React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Dimensions
} from 'react-native';

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
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      filename: '',
      imageuri: '',
      isChosen: false,
      isUploaded: false,
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe = null;
  }

  componentDidMount() {
    console.log('calling handel photo')
    this.handlePhoto()
  }


  handlePhoto = () => {
    console.log('picking das photo')
    const options = {
      noData: true
    };
    ImagePicker.launchImageLibrary(options, (response)=>{
      if(response.uri){
        this.setState({ imageuri: response.uri,
                        filename: response.filename,
                        isChosen: true
        });
        this.props.navigation.push("CaptionPage", {
          imageuri: this.state.imageuri,
          filename: this.state.filename
          upload: this.})

      }
    });
    this.state.isChosen = false;
  }

  render() {
    // if(this.state.isChosen==false&&this.state.isUploaded==false){
      //choose the photo
      if (this.state.isChosen === false){
        this.handlePhoto();
      }
    return (

      <View/>
      );
  }
}
export default ImageUpload;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navBar: {
    height: '15%',
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: '#D6D6D6'
  },
  textStyle: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
  },
  container2: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%'
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
  },
  button: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    bottom: '5%',
    alignItems: 'center',
		justifyContent: 'center'
  }
});
