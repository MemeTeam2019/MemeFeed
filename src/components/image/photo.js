import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import AutoHeightImage from 'react-native-auto-height-image';

class Photo extends React.PureComponent {
  render() {
    console.log(this.props.imageUrl);
    return (
      <View style={styles.modelStyle}>
        <AutoHeightImage
          width={Dimensions.get('window').width}
          source={{ uri: this.props.imageUrl }}
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
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: .5,
    borderColor: '#D6D6D6',
  },
});
