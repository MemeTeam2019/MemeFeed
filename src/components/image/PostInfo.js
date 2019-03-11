import React, { Component } from 'react';
import {Button, StyleSheet, View, Image, Text, TouchableOpacity, Modal } from 'react-native';
import firebase from 'react-native-firebase';


import CommentPage from '../../screens/CommentPage';
import CommentSample from './CommentSample';
import { withNavigation } from "react-navigation";

class PostInfo extends React.Component{

  constructor(){
    super();
    this.unsubscribe = null;
    this.state = {
      commentCount: 0,
      commentString: "view all comments plz chng",
      imageuri: '',
      memeId: '',
      ModalVisibleStatus: false,
      source: 'testing',
    };
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = () => {
    var countRef = firebase.firestore().collection("Comments/"+this.props.memeId+"/Info").doc('CommentInfo');
    countRef.get().then(doc => {
        if (doc.exists) {
          const {count} = doc.data();
          this.setState({
            commentString: "View all "+count+" comments",
            commentCount: count
          });

        }

    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }

  componentDidMount() {
    this.unsubscribe = firebase.firestore().collection("Comments/"+this.props.memeId+"/Info").doc('CommentInfo').onSnapshot(this.onCollectionUpdate); // we choose decsending to get most recent
  }

  ShowModalFunction(visible) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: this.props.imageURL,
      memeId: this.props.memeId,
      source: this.props.source,
    });
  }

  handleCommentClick() {
    this.props.navigation.navigate("Comment", {
      memeId: this.props.memeId,
      uri: this.props.imageUrl
    });
  }

render() {

//   if (this.state.ModalVisibleStatus) {
//     //Modal to show full image with close button
//     return (
//       <Modal
//         transparent={false}
//         animationType={'fade'}
//         visible={this.state.ModalVisibleStatus}
//         onRequestClose={() => {
//           this.ShowModalFunction(!this.state.ModalVisibleStatus);
//         }}
//       >
//         <View style={styles.modelStyle}>
//           <CommentPage
//             memeId={this.props.memeId}
//             imageUrl={this.props.imageUrl}
//           />
//           {/* Close Button */}
//           <TouchableOpacity
//             activeOpacity={0.5}
//             style={styles.closeButtonStyle}
//             onPress={() => {
//               this.ShowModalFunction(!this.state.ModalVisibleStatus);
//             }}>
//             <Image
//               source={{
//                 uri:
//                   'https://aboutreact.com/wp-content/uploads/2018/09/close.png',
//                 }}
//                 style={{ width: 25, height: 25, marginTop:16 }}
//             />
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       );} else
       if (this.state.commentCount > 2) {
        return(
         <View style={styles.postInfo}>
           <TouchableOpacity
              onPress={() => {
                this.handleCommentClick();
              }}>
              <Image
                style={styles.commentButtonStyle}
                source={require('../../images/Tile/chatLogo2.png')}
              />
            </TouchableOpacity>
            <Text style={{fontFamily: 'AvenirNext-Regular', paddingTop: 3, marginLeft: '2.5%'}}>{this.props.reactCount} Reactions</Text>
            <CommentSample memeId={this.props.memeId}/>

            <View style={{flex: 1, flexDirection: 'row'}}>
              <TouchableOpacity
                 onPress={() => {
                  this.handleCommentClick();
                }}
              >
              <Text style={styles.commentStringStyle}>{this.state.commentString}</Text>
              </TouchableOpacity>

            </View>

          </View>
        );
      } else {
        return(
          <View style={styles.postInfo}>
              <TouchableOpacity
              onPress={() => {
                this.handleCommentClick();
              }}>
              <Image
                style={styles.commentButtonStyle}
                source={require('../../images/Tile/chatLogo2.png')}
              />
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', paddingTop: 3, marginLeft: '2.5%'}}>{this.props.reactCount} Reactions</Text>
            <CommentSample memeId={this.props.memeId}/>
           </View>
        );
      }
    }
}


export default withNavigation(PostInfo);

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
  commentButtonStyle: {
    height: 32,
    width: 30,
    marginLeft: 15,
    position: 'absolute',
    bottom: 8
  },
  commentStringStyle: {
    fontFamily: 'AvenirNext-Bold',
    paddingTop: 10,
    marginLeft: 10,
    //color: '#383838'
  }

  });
