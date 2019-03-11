import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';


class EmptyProfileFeed extends React.Component {

  render() {
    return (
      <View style={styles.container}>
      <Image
      source={require('../noPosts.png')}
      style={{width: '100%', height: '100%'}}
      />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
export default EmptyProfileFeed;
