import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import Grid from 'react-native-grid-component';

/**
 * Displays memes in a Grid format. When a meme is pressed, it will navigate
 * to a Tile where the user can interact with it.
 *
 * Recieves an array of Meme Objects, obtained from firebase. Refer to Memes
 * collection in Firebase for fields.
 *
 * Props - memes: Array[Object]
 */
class MemeGrid extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
  }

  _renderItem = (data, i) => {
    if (!data || !data.src) {
      return this._renderPlaceholder(i);
    }
    return (
      <View style={[styles.item]} key={i}>
        <TouchableOpacity
          style={{
            flex: 1,
          }}
          onPress={() => {
            this.props.navigation.push('Tile', {
              memes: [data],
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

  navigateToTilePage(data) {
    const { navigation } = this.props;
    navigation.push('Tile', {
      memes: [data],
    });
  }

  render() {
    //const { memes } = this.props;
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={this.props.memes}
        itemsPerRow={3}
        onEndReached={() => {
          console.log('on end reached')
          console.log('===========\n\n\n\nloading more memes\n===============')
          // Call parent function
          this.props.loadMemes();
          console.log(this.props.memes)


        }}
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
