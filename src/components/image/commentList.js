import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Comment from './comment';

class CommentList extends React.Component {
  /**
   * Renders a single comment item wrapped in a <View> tag.
   *
   * @param {Object} item: Element of this.state.comments, obtained from updateComments
   * @returns {JSXElement} Comment component wrapped in a <View>
   */
  renderComment = (item) => {
    return (
      <View>
        <Comment
          key={item.key}
          username={item.username}
          content={item.content}
          uid={item.uid}
        />
      </View>
    );
  };

  render() {
    const { comments } = this.props;
    console.log(comments);
    return (
      <View key={this.props.comments} style={styles.container}>
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
        {comments.map((comment) => {
          console.log(this.renderComment(comment));
          return this.renderComment(comment);
        })}
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
    marginTop: '5%',
    marginBottom: '10%',
    marginHorizontal: '2.5%',
    height: '100%',
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
