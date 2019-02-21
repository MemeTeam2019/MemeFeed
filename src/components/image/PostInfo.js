import React, { Component } from 'react';
import {Button, StyleSheet, View, Image, Text } from 'react-native';

class PostInfo extends React.Component{
    render() {
        return (
            <View style={styles.postInfo}>
                <Text style={{fontStyle: 'italic', fontWeight: 'bold', marginLeft: '2.5%'}}>source</Text>
                <Text style={{fontWeight: 'bold', paddingTop: 3, marginLeft: '2.5%'}}>20 Reactions</Text>
                <Text style={{fontWeight: 'bold', paddingTop: 10, marginLeft: '2.5%'}}>username
                    <Text style={{fontWeight: 'normal'}}> comment</Text>
                </Text>
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
    },
  });