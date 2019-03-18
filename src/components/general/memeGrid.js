import React from 'react';
import { withNavigation } from 'react-navigation';

//import React in our project
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

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
  constructor() {
    super();
    this._isMounted = false;
    this.state = {
      memesLoaded: 30,
      imageuri: '',
      ModalVisibleStatus: false,
      isLoading: true,
      items: [],
    };
  }

  ShowModalFunction(visible, imageURL) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount(memesLoaded) {
    this._isMounted = true;
    if (this._isMounted) {
      this.props.loadMemes(9);
    }
  }

  navigateToTilePage(data) {
    console.log('yoooooooo');
    this.props.navigation.push('Tile', {
      memes: [data],
    });
  }

  _renderItem = (data, i) => {
    if (!data || !data.src) {
      return this._renderPlaceholder(i)
    }
    return (
      <View style={[styles.item]} key={i}>
        <TouchableOpacity
          style={{
            flex: 1,
          }}
          onPress={() => {
            this.navigateToTilePage(data);
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

  _renderPlaceholder = i => <View style={styles.item} key={i} />;

  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={this.props.memes}
        itemsPerRow={3}
        onEndReached={() => {
          // Ensuring there are actually memes to load
          if (this.props.memes.length == this.state.memesLoaded) {
            newLoadCount = this.state.memesLoaded + 60;
            this.setState({
              memesLoaded: newLoadCount,
            });

            // Call parent function
            // this.props.loadMemes(newLoadCount);
          }
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
