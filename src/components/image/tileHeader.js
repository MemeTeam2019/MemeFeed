import React from 'react';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

import LikedFromReddit from './tileHeaders/likedFromReddit';
import LikedFromUser from './tileHeaders/likedFromUser';
import SourceReddit from './tileHeaders/sourceReddit';

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
    console.log(this.props.likedFrom);
    // if meme is just from a sub reddit
    if (this.props.sub) {
      return <SourceReddit sub={this.props.sub} memeId={this.props.memeId} />;
    }
    // if meme liked from reddit
    if (this.state.username === '') {
      return (
        <LikedFromReddit
          poster={this.props.poster}
          sub={this.props.likedFrom}
          memeId={this.props.memeId}
        />
      );
    }
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

export default withNavigation(TileHeader);
