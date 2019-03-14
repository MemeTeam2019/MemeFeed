import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text, ScrollView, KeyboardAvoidingView } from 'react-native';

import AddComment from '../components/image/AddComment';
import ButtonBar from '../components/image/ButtonBar';
import CommentHeader from '../components/image/CommentHeader';
import CommentList from '../components/image/CommentList';
import TileHeader from '../components/image/TileHeader';
import Photo from '../components/image/Photo';


class CommentPage extends React.Component {
  constructor(props){
    super(props);
    this.unsubscribe = null;
    this.state = {
      imageuri: this.props.navigation.getParam("uri"),
      memeId: this.props.navigation.getParam("memeId")
    };
  }

  static navigationOptions = {
    tabBarVisible: false,
  }

  // static navigationOptions = {
  //   header: null
  // }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={ref => this.scrollView = ref}
          onContentSizeChange={(contentWidth, contentHeight)=>{
            this.scrollView.scrollToEnd({animated: true});
          }}
        >

            <TileHeader/>
            <Photo imageUrl={this.state.imageuri}/>
            <CommentList memeId={this.state.memeId}/>

        </ScrollView>
        <AddComment memeId={this.state.memeId}/>

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
});
