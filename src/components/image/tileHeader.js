import React from 'react';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

import LikedFromReddit from './tileHeaders/likedFromReddit';
import LikedFromUser from './tileHeaders/likedFromUser';
import SourceReddit from './tileHeaders/sourceReddit';
import PostedByUser from './tileHeaders/postedByUser'


/**
 * Renders the meme poster or the subreddit from which a meme was pulled from.
 *
 * Used by:
 *    tile.js
 *    commentPage.js
 *
 * Props:
 *    sub (String): The subreddit the meme was pulled from.
 *    poster (String): The poster of the meme.
 *    likedFrom (String): The user the liker found the post from.
 */
class TileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    };
  }

  /**
   * Fetch the username of the person this meme was likedFrom
   */
  componentDidMount() {
    firebase
      .firestore()
      .collection('Users')
      .doc(this.props.likedFrom)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { username } = doc.data();
          this.setState({ username });
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  }

  render() {
    // Meme was sourced from a subreddit
    if (this.props.sub) {
      return (
        <SourceReddit
          sub={this.props.sub}
          isSubRedditPg={this.props.isSubRedditPg}
          memeId={this.props.memeId}
        />
      );
    }
    // Meme was posted by a user
    else if (!(this.props.likedFrom)) {
        return <PostedByUser poster={this.props.poster}/>;
    }
    // Meme was liked from a subreddit
    else if (this.state.username === '') {
      return (
        <LikedFromReddit
          poster={this.props.poster}
          sub={this.props.likedFrom}
          memeId={this.props.memeId}
          isSubRedditPg={this.props.isSubRedditPg}
        />
      );
    }
    else {
      // if meme liked from user
      return (
        <LikedFromUser
          poster={this.props.poster}
          likedFrom={this.props.likedFrom}
          memeId={this.props.memeId}
        />
      );
    }
  }
}

export default withNavigation(TileHeader);
