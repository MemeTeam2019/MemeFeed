import React from 'react';
import { StyleSheet, FlatList, RefreshControl, View } from 'react-native';

import Tile from '../image/tile';

/**
 * Renders a list of memes using the Tile component.
 *
 * @prop {Array[Object]} memes: Array of objects which hold data obtained from
 *                              the meme document
 * @prop {function} loadMemes: Callback obtained from parent component to update
 *                             memes and pass down a new memes prop
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
      <Tile
        style={styles.tile}
        id={item.key}
        memeId={item.key}
        imageUrl={item.src}
        sub={item.sub}
        likedFrom={item.likedFrom}
        postedBy={item.postedBy}
        poster={item.poster}
        time={item.time}
        caption={item.caption}
        isSubRedditPg={this.props.isSubRedditPg}
        reacts={item.reacts}
      />
    );
  };

  render() {
    return (
      <React.Fragment>
        <FlatList
          // style={styles.container}
          data={this.props.memes}
          extraData={this.props}
          keyExtractor={(item) => item.key}
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
      </React.Fragment>
    );
  }
}

export default MemeList;

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  tile: {
    flex: 1,
  },
});
