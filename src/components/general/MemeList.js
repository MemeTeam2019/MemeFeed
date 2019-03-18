import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import Tile from '../image/tile';

/**
 * Render a list of memes using the Tile component
 *
 * Props
 * -----
 * memes: Array[Object]
 * loadMemes: function
 */
class MemeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memesLoaded: 30,
      imageuri: '',
      isLoading: true,
      memes: [],
    };
  }

  renderTile = ({ item }) => {
    if (!item || !item.src) return;
    return (
      <Tile
        memeId={item.key}
        imageUrl={item.src}
        sub={item.sub}
        likedFrom={item.likedFrom}
        postedBy={item.postedBy}
        poster={item.poster}
      />
    );
  };

  render() {
    return (
      <FlatList
        style={styles.containerStyle}
        data={this.props.memes}
        renderItem={this.renderTile.bind(this)}
        onEndReached={() => {
          // Ensuring there are actually memes to load
          if (this.props.memes.length == this.state.memesLoaded) {
            newLoadCount = this.state.memesLoaded + 60;
            this.setState({
              memesLoaded: newLoadCount,
            });

            // Call parent function
            this.props.loadMemes(newLoadCount);
          }
        }}
      />
    );
  }
}

export default MemeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
