import React, { Component } from 'react';
import {Button, StyleSheet, View, Image, Text } from 'react-native';

class PostInfo extends React.Component{
    render() {
        return (
            <View style={styles.container}>
                <Text>source</Text>
                <Text>20 Reactions</Text>
                <Text>username: comment</Text>
            </View>
        );
    }
}

export default PostInfo;

const styles = StyleSheet.create({
    container: {
      fontSize: 16,
      fontFamily: 'AvenirNext-Regular',
      width: '100%',
      height: 100,
      borderColor: 'rgb(233,233,233)',
      borderTopWidth: StyleSheet.hairlineWidth
    },
  });