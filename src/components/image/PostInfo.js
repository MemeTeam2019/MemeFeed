import React, { Component } from 'react';
import {Button, StyleSheet, View, Image, Text, TouchableOpacity, Modal } from 'react-native';


import CommentPage from './CommentPage';
import CommentSample from './CommentSample';

class PostInfo extends React.Component{

  constructor(){
    super();
    this.state = {
      imageuri: '',
      memeId: '',
      ModalVisibleStatus: false,
    };
  }

  ShowModalFunction(visible, imageURL, memeId) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: this.props.imageURL,
      memeId: this.props.memeId
    });
  }


render() {

  if (this.state.ModalVisibleStatus) {
    //Modal to show full image with close button
    return (
      <Modal
        transparent={false}
        animationType={'fade'}
        visible={this.state.ModalVisibleStatus}
        onRequestClose={() => {
          this.ShowModalFunction(!this.state.ModalVisibleStatus,'');
        }}
      >
        <View style={styles.modelStyle}>
          <CommentPage
            memeId={this.props.memeId}
            imageUrl={this.props.imageUrl}
          />
          {/* Close Button */}
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.closeButtonStyle}
            onPress={() => {
              this.ShowModalFunction(!this.state.ModalVisibleStatus,'');
            }}>
            <Image
              source={{
                uri:
                  'https://aboutreact.com/wp-content/uploads/2018/09/close.png',
                }}
                style={{ width: 25, height: 25, marginTop:16 }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
      );
      } else {
        return(
          <View style={styles.postInfo}>
            <Text style={{fontStyle: 'italic', fontWeight: 'bold', marginLeft: '2.5%'}}>source</Text>
            <Text style={{fontWeight: 'bold', paddingTop: 3, marginLeft: '2.5%'}}>20 Reactions</Text>
            <CommentSample memeId={this.props.memeId}/>


            <View style={{flex: 1, flexDirection: 'row'}}>
              <Button
                onPress={() => {
                  this.ShowModalFunction(true, this.props.imageURL, this.props.memeId);
                }}
                style={{fontSize: 1}}
                title="View all comments"
                color='#3d97ff'
              />
            </View>

          </View>
        );
      }
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
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 20,
    right: 9,
    position: 'absolute',
  },


  });