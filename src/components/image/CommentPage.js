import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text, ScrollView, KeyboardAvoidingView } from 'react-native';

import AddComment from './AddComment';
import ButtonBar from './ButtonBar';
import CommentHeader from './CommentHeader';
import CommentList from './CommentList';
import TileHeader from './TileHeader';
import Photo from './Photo';

class CommentPage extends React.Component {
  render() {
    return ( 
      <View style={styles.container}>
      <CommentHeader/>
        <ScrollView
          ref={ref => this.scrollView = ref}

          onContentSizeChange={(contentWidth, contentHeight)=>{        
            this.scrollView.scrollToEnd({animated: true});
          }}
        >
        <KeyboardAvoidingView behavior="position">
          <TileHeader/>
          <Photo imageUrl={this.props.imageUrl}/>  
          <CommentList memeId={this.props.memeId}/>
        </KeyboardAvoidingView>
        </ScrollView>
        <AddComment memeId={this.props.memeId}/>



      </View>
    );
  }
}

export default CommentPage; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom:0
  },
    containerA: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

});
 