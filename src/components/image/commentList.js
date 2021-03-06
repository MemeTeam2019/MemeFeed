import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';

import Comment from './comment';

/**
 * Renders comments passed down via the comments prop.
 * @props {Array[Object]} comments: A a list of objects which contain the appropriate information
 *                                  for each comment.
 * @props {number} time: Unix time of when the meme was posted, obtained from the Meme document.
 */
class CommentList extends React.PureComponent {
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
      <Comment
        key={item.key}
        username={item.username}
        content={item.content}
        uid={item.uid}
        usernamesTagged={item.usernamesTagged || []}
      />
    );
  };

  /**
   * Converts the `time` field from the Firebase Meme document to
   * human-readable time.
   *
   * @param {number} unixTime - Time the meme was posted in unix time
   * @returns {string} Human-readable timestamp
   */
  convertTime = (unixTime) => {
    const theMoment = moment.unix(unixTime);
    if (theMoment.isValid()) {
      return theMoment.fromNow();
    }
    return 'A while ago';
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
        <View>{comments.map((comment) => this.renderComment(comment))}</View>
        <Text style={styles.timestamp}>
          {this.convertTime(this.props.time)}
        </Text>
      </View>
    );
  }
}

export default CommentList;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,0,255,1)',
    marginHorizontal: '2.5%',
  },
  loadMoreText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'AvenirNext-Bold',
    textAlign: 'left',
  },
  loadMore: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  timestamp: {
    fontFamily: 'AvenirNext-Regular',
    fontWeight: '300',
    color: '#919191',
    marginTop: '5%',
    marginBottom: '20%',
  },
});
