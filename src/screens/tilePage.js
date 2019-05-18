import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import Tile from '../components/image/tile';

class TilePage extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTile({ item }) {
    //for list view
    //console.log(item.key);
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
  }

  render() {
    return (
      <FlatList
        style={styles.containerStyle}
        data={this.props.navigation.getParam('memes')}
        renderItem={this.renderTile.bind(this)}
      />
    );
  }
}

export default TilePage;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
});
