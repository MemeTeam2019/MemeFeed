import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';

import { withNavigation } from 'react-navigation';

class CommentButton extends React.Component {
  handleCommentClick() {
    this.props.navigation.navigate('Comment', {
      memeId: this.props.memeId,
      uri: this.props.imageUrl,
      sub: this.props.sub,
      likedFrom: this.props.likedFrom,
      postedBy: this.props.postedBy,
      poster: this.props.poster,
      caption: this.props.caption,
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
