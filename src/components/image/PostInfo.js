import React, { Component } from 'react';
import {Button, StyleSheet, View, Image, Text } from 'react-native';

class PostInfo extends React.Component{
    render() {
        return (
            <View style={styles.container}>
                <Text>20 Reactions</Text>
                <Text>username: comment</Text>
            </View>
        );
    }
}

export default PostInfo;

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      flex: 1,
      backgroundColor: '#fff',
      fontSize: 16,
      fontFamily: 'AvenirNext-Regular',
      height: '100%',
      width: '100%'
    },
  });