import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { withNavigation } from 'react-navigation';

/** 
 * Comment Button component. 
 * It is the speech bubble button below the meme next to the button bar
 * 
 * Used by:
 *    tile.js
 * 
 * Props:
 *    this.props.memeId,
      this.props.imageUrl,
      this.props.sub,
      this.props.likedFrom,
      this.props.postedBy,
      this.props.poster,
      this.props.caption,
      this.props.time,
*/

class CommentButton extends React.Component {
  handleCommentClick() {
    // When the button is pressed, it will navigate to Comment.js
    this.props.navigation.navigate('Comment', {
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
