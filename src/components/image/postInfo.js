import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
import moment from 'moment';

import CommentSample from './commentSample';

class PostInfo extends React.Component {
  constructor() {
    super();
    this.unsubscribe = null;
    this.state = {
      commentCount: 0,
      commentString: '',
    };
  }

  /**
   * Grab the first two comments for this particular meme
   */
  componentDidMount() {
    firebase
      .firestore()
      .collection(`CommentsTest/${this.props.memeId}/Info`)
      .doc('CommentInfo')
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { count } = doc.data();
          this.setState({
            commentString: `View all ${count} comments`,
            commentCount: count,
          });
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  }

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

  /**
   * Handles navigation to the comment page.
   */
  handleCommentClick = () => {
    const {
      memeId,
      imageUrl,
      sub,
      likedFrom,
      postedBy,
      poster,
      time,
      caption,
    } = this.props;
    this.props.navigation.navigate('Comment', {
      memeId,
      uri: imageUrl,
      sub,
      likedFrom,
      postedBy,
      poster,
      time,
      caption,
    });
  };

  render() {
    // Don't render CommentSample because we are in CommentPage
    if (this.props.showAllComments) {
      return (
        <View style={styles.container}>
          <Text style={styles.reactionsText}>
            {this.props.reactCount} Reactions
          </Text>
          <Text style={styles.captionText}>{this.props.caption}</Text>
        </View>
      );
    }
    // Render a 'View all n comments'
    if (this.state.commentCount > 2) {
      return (
        <View style={styles.container}>
          <View style={{ marginBottom: '2%' }}>
            <Text style={styles.reactionsText}>
              {this.props.reactCount} Reactions
            </Text>
            <Text style={styles.captionText}>{this.props.caption}</Text>
            <CommentSample memeId={this.props.memeId} />
            <TouchableOpacity onPress={this.handleCommentClick}>
              <Text style={styles.commentStringStyle}>
                {this.state.commentString}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.timestamp}>
            {this.convertTime(this.props.time)}
          </Text>
        </View>
      );
    }
    // Render just one comment in the sample
    return (
      <View style={styles.container}>
        <View style={{ marginBottom: '2%' }}>
          <Text style={styles.reactionsText}>
            {this.props.reactCount} Reactions
          </Text>
          <Text style={styles.captionText}>{this.props.caption}</Text>
          <CommentSample memeId={this.props.memeId} />
        </View>
        <Text style={styles.timestamp}>
          {this.convertTime(this.props.time)}
        </Text>
      </View>
    );
  }
}

export default withNavigation(PostInfo);

const styles = StyleSheet.create({
  container: {
    marginLeft: '2.5%',
  },
  reactionsText: {
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'AvenirNext-Bold',
  },
  commentStringStyle: {
    fontFamily: 'AvenirNext-Bold',
    paddingTop: 10,
  },
  caption: {
    paddingTop: 4,
    paddingBottom: 8,
  },
  captionText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    // marginHorizontal: '2.5%',
  },
  timestamp: {
    fontFamily: 'AvenirNext-Regular',
    fontWeight: '300',
    color: '#919191',
  },
});
