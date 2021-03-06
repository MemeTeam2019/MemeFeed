import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

import ButtonBar from './buttonBar';
import Photo from './photo';
import TileHeader from './tileHeader';
import PostInfo from './postInfo';
import CommentButton from './commentButton';

/**
* Component for each meme.
* Uses tileHeader.js, photo.js, buttonBar.js, postInfo.js
*
* Used by:
*   memeList.js
*   commentPage.js
*   tilePage.js
*   subReddit.js
*
* Props:
*   sub (String): The subreddit the meme was scraped from
*   likedFrom (String): The uid of the user another user liked the associated
*     meme from
*   poster (String): The uid of the user who posted the associated meme
*   memeId (String): The id of the Firebase document in the Memes collection
*   imageUrl (String): The image URL of the meme
*   postedBy (String): The uid of the user who posted the meme associated with
*     the memeId
*   caption (String): The caption associated with the meme. scraped from Reddit
*      along with the meme
*   time (String): The time each meme was posted to the feeds
*/

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.unsubscribe = false;
    this.updateReactCount = this.updateReactCount.bind(this);
    this.state = {
      reactCount: this.props.reacts,
    };
  }

  /**
   * Fetch the commentCount from the appropriate Meme document
   */
  componentDidMount() {
    const memeid = this.props.memeId;
    const ref = firebase
      .firestore()
      .collection('Memes')
      .doc(memeid);
    ref.get().then((docSnapshot) => {
      const data = docSnapshot.data();
      const reactCount = data.reactCount || 0;
      this.setState({ reactCount });
    });
  }

  componentWillUnmount() {
    this.unsubscribe = null;
  }

  /**
   * Updates the react count for a meme. Passed down as a callback to ButtonBar component.
   *
   * @param {number} newReactCount: The updated react count when a user reacts to a meme
   */
  updateReactCount(newReactCount) {
    this.setState({ reactCount: newReactCount });
  }

  render() {
    return (
      <View style={styles.container}>
        <TileHeader
          sub={this.props.sub}
          likedFrom={this.props.likedFrom}
          poster={this.props.poster}
          memeId={this.props.memeId}
          isSubRedditPg={this.props.isSubRedditPg}
        />
        <Photo imageUrl={this.props.imageUrl} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderColor: '#D6D6D6',
            borderTopWidth: 0.5,
          }}
        >
          <View>
            <CommentButton
              imageUrl={this.props.imageUrl}
              memeId={this.props.memeId}
              sub={this.props.sub}
              likedFrom={this.props.likedFrom}
              postedBy={this.props.postedBy}
              poster={this.props.poster}
              caption={this.props.caption}
              time={this.props.time}
            />
          </View>
          <View>
            <ButtonBar
              imageUrl={this.props.imageUrl}
              memeId={this.props.memeId}
              postedBy={this.props.postedBy}
              updateReacts={this.updateReactCount}
              caption={this.props.caption}
              reacts={this.props.reacts}
            />
          </View>
        </View>
        <PostInfo
          memeId={this.props.memeId}
          reactCount={this.state.reactCount}
          imageUrl={this.props.imageUrl}
          sub={this.props.sub}
          likedFrom={this.props.likedFrom}
          postedBy={this.props.postedBy}
          poster={this.props.poster}
          showAllComments={this.props.showAllComments}
          caption={this.props.caption}
          time={this.props.time}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 5,
  },
  buttonbar: {
    flexDirection: 'row',
  },
});

export default withNavigation(Tile);
