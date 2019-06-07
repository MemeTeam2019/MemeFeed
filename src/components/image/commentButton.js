import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { withNavigation } from 'react-navigation';

/**
* Comment Button component.
* It is the speech bubble button below the meme next to the button bar
*
* Used by:
*   tile.js
*
* Props:
*   memeId (String): The id of the Firebase document in the Memes collection
*   imageUrl (String): The image URL of the meme
*   sub (String): The subreddit the meme was scraped from
*   likedFrom (String): The uid of the user another user liked the associated
*     meme from
*   postedBy (String): The uid of the user who posted the meme associated with
*     the memeId
*   poster (String): The uid of the user who posted the associated meme
*   caption (String): The caption associated with the meme. scraped from Reddit
*     along with the meme
*   time (String): The time each meme was posted to the feeds or entered into
*     Firebase
*/

class CommentButton extends React.Component {
  /**
   * Handles navigation to the comment page associated with the memeId
   */
  handleCommentClick = () => {
    this.props.navigation.push('Comment', {
      memeId: this.props.memeId,
      uri: this.props.imageUrl,
      sub: this.props.sub,
      likedFrom: this.props.likedFrom,
      postedBy: this.props.postedBy,
      poster: this.props.poster,
      caption: this.props.caption,
      time: this.props.time,
    });
  }

  render() {
    return (
      <View style={styles.button}>
        <TouchableOpacity
          onPress={() => {
            this.handleCommentClick();
          }}
        >
          <Image
            style={{ width: 30, height: 32 }}
            source={require('../../images/Tile/chatLogo2.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginLeft: '10%',
    marginTop: '15%',
    alignItems: 'flex-start',
  },
});

export default withNavigation(CommentButton);
