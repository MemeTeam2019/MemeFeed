import React from 'react';
import { Dimensions, StyleSheet, View, Image } from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';

class Photo extends React.PureComponent {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      width: Dimensions.get('window').width,
      height: 0,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const memeid = this.props.memeId;
    Image.getSize(this.props.imageUrl, (imageWidth, imageHeight) => {
      width = Dimensions.get('window').width;
      height = (width / imageWidth) * imageHeight;
      this.setState({ width, height });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.unsubscribe = null;
  }

  render() {
    return (
      <View style={styles.modelStyle}>
        <Image
          source={{
            uri: this.props.imageUrl,
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
