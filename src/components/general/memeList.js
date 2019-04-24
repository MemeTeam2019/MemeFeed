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
      imageuri: '',
      isLoading: true,
      memes: [],
    };
  }

  renderTile = ({ item }) => {
    if (!item || !item.src) return null;
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
          // only load memes if previous ones finished loading
          this.props.loadMemes();
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
