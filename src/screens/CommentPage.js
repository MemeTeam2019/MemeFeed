import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';

import AddComment from '../components/image/addComment';
import CommentList from '../components/image/commentList';
import TileHeader from '../components/image/tileHeader';
import Photo from '../components/image/photo';

/**
 * Display comments for a meme, along with the buttonBar and the meme itself.
 * 
 * Props
 * -----
 * navigtion.uri: String
 * navigation.memeId: String
 */
class CommentPage extends React.Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.scrollView = null;
    this.state = {
      imageuri: this.props.navigation.getParam('uri', null),
      memeId: this.props.navigation.getParam('memeId', null),
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.scrollView.scrollToEnd({ animated: true });
          }}
        >
          <TileHeader />
          <Photo imageUrl={this.state.imageuri} />
          <CommentList memeId={this.state.memeId} />
        </ScrollView>
        <AddComment memeId={this.state.memeId} />
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
    bottom: 0,
  },
});
