import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

// import ButtonBar from './buttonBar';
import Comment from './comment';

class CommentList extends React.PureComponent {
  // Render a single comment item, making sure to wrap it in a <View>
  renderComment = (item) => {
    if (item) {
      return (
        <View key={item.key}>
          <Comment
            key={item.key}
            username={item.username}
            content={item.content}
            uid={item.uid}
          />
        </View>
      );
    }
    return null;
  };

  render() {
    const { comments } = this.props;
    return (
      <View style={styles.container}>
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
