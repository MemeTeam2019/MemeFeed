import React from 'react';
import { Dimensions, StyleSheet, View, Image } from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';

/**
 * The photo component. Extracts the width and height of the item before rendering.
 * 
 * Used by:
 *  tile.js
 */

class Photo extends React.Component {
  /**
   * Full width image.
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width,
      height: 0,
    };
  }

  /**
   * Sets the dimensions of the image as state
   */
  componentDidMount() {
    Image.getSize(this.props.imageUrl, (imageWidth, imageHeight) => {
      width = Dimensions.get('window').width
      height = (width / imageWidth) * imageHeight
      this.setState({width, height})
    });
  }

  render() {
    return (
      <View style={styles.modelStyle}>
        <Image
          source={{
            uri: this.props.imageUrl,
          }}
          style={{width: this.state.width, height: this.state.height, resizeMode: 'contain', }}
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
    borderTopWidth: .5,
    borderColor: '#D6D6D6',
  },
});
