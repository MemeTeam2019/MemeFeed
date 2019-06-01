import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Comment from './comment';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.renderComment = this.renderComment.bind(this);
  }

  /**
   * Renders a single comment item wrapped in a <View> tag.
   *
   * @param {Object} item: Element of this.state.comments, obtained from updateComments
   * @returns {JSXElement} Comment component wrapped in a <View>
   */
  renderComment = (item) => {
    return (
      <View key={item.key}>
        <Comment
          key={item.key}
          uid={item.uid}
          username={item.username}
          content={item.content}
        />
      </View>
    );
  };

  render() {
    const { comments } = this.props;
    return (
      <View key={this.props.comments} style={{ marginHorizontal: '2.5%' }}>
        {/* Only render "Load more" if there are more comments to load */}
        {this.props.commentsLoaded < this.props.commentCount && (
          <TouchableOpacity
            onPress={this.props.fetchComments}
            style={styles.loadMore}
          >
            <Text style={styles.loadMoreText}>Load more comments</Text>
          </TouchableOpacity>
        )}
        {/* Map each comment to a comment component */}
        {comments.map((comment) => this.renderComment(comment))}
      </View>
    );
  }
}

export default CommentList;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    marginHorizontal: '2.5%',
  },
  loadMoreText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'AvenirNext-Bold',
    textAlign: 'center',
  },
  loadMore: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
