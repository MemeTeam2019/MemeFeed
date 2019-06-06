import React from 'react';
import firebase from 'react-native-firebase';
import { Dimensions, StyleSheet, View, Image } from 'react-native';

class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      height: 0,
    };
  }

  componentDidMount() {
    const memeId = this.props.memeId;
    this._isMounted = true;
    Image.getSize(this.props.imageUrl, (imageWidth, imageHeight) => {
      const width = Dimensions.get('window').width;
      const height = (width / imageWidth) * imageHeight;
      this.setState({ width, height });
    });

    // If meme is in this users recommendations set the time to 0 to ensure the
    // meme won't be recommended to them again
    const recRef = firebase
      .firestore()
      .collection('Recommendations')
      .doc(firebase.auth().currentUser.uid)
      .collection('Memes')
      .doc(memeId);

    recRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          recRef.update({ time: 0 });
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  }

  render() {
    return (
      <View style={styles.modelStyle}>
        <Image
          source={{
            uri: this.props.imageUrl || null,
            cache: 'force-cache',
          }}
          style={{
            width: this.state.width,
            height: this.state.height,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  }
}

export default Photo;

const styles = StyleSheet.create({
  fullImageStyle: {
    marginTop: '20%',
    width: Dimensions.get('window').width,
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: '#D6D6D6',
  },
});
