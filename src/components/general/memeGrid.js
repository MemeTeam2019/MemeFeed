import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Grid from 'react-native-grid-component';

/**
 * Renders memes in a grid view. Each grid is touchable and navigates to the
 * associated CommentPage.
 *
 * @prop {Array[Object]} memes: Array of objects which hold data obtained from
 *                              the meme document
 * @prop {function} loadMemes: Callback obtained from parent component to update
 *                             memes and pass down a new memes prop
 */
class MemeGrid extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  _renderItem = (data, i) => {
    if (!data || !data.src) {
      return this._renderPlaceholder(i);
    }
    const { src, key, sub, likedFrom, postedBy, poster, numFlags } = data;
    if (numFlags >= 10 || src === '') return null;
    return (
      <View style={[styles.item]} key={i}>
        <TouchableOpacity
          style={{
            flex: 1,
          }}
          onPress={() => {
            this.props.navigation.push('Comment', {
              uri: src,
              memeId: key,
              sub,
              likedFrom,
              postedBy,
              poster,
              isSubRedditPg: this.props.isSubRedditPg,
              caption: data.caption,
              time: data.time,
            });
          }}
        >
          <Image
            style={{ flex: 1 }}
            source={{
              uri: data.src,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  _renderPlaceholder = (i) => <View style={styles.item} key={i} />;

  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={this.props.memes}
        itemsPerRow={3}
        onEndReached={this.props.loadMemes}
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

export default withNavigation(MemeGrid);

const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 160,
    margin: 1,
    aspectRatio: 1,
  },
  list: {
    flex: 1,
  },
  containerStyle: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: 20,
    flex: 1,
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 9,
    position: 'absolute',
  },
});
