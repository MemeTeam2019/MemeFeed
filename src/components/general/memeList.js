import React from 'react';
import { StyleSheet, FlatList, RefreshControl, View } from 'react-native';

import Tile from '../image/tile';

/**
 * Render a list of memes using the Tile component
 *
 * Props
 * -----
 * memes: Array[Object]
 * loadMemes: function
 */
class MemeList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderTile = this.renderTile.bind(this);
  }

  renderTile = ({ item }) => {
    if (!item || !item.src || item.numFlags >= 10 || item.src === '')
      return null;

    return (
      <View style={styles.container}>
        <Tile
          id={item.key}
          memeId={item.key}
          imageUrl={item.src}
          sub={item.sub}
          likedFrom={item.likedFrom}
          postedBy={item.postedBy}
          poster={item.poster}
          isSubRedditPg={this.props.isSubRedditPg}
        />
      </View>
    );
  };

  render() {
    return (
      <FlatList
        style={styles.container}
        data={this.props.memes}
        extraData={this.props}
        keyExtractor={(item, index) => index}
        renderItem={this.renderTile}
        onEndReached={() => {
          // Load new memes once end of list is reached
          this.props.loadMemes();
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
      />
    );
  }
}

export default MemeList;

const styles = StyleSheet.create({
  container: {
     flexGrow: 1
  },
});
