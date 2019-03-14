import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import ButtonBar from './ButtonBar';
import Photo from './Photo';
import TileHeader from './TileHeader';
import PostInfo from './PostInfo';

import firebase from "react-native-firebase";

class Tile extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.updateReactCount = this.updateReactCount.bind(this);
    this.state = {
      reactCount: 0,
    }
  }

  componentDidMount() {
    this._isMounted = true;
    const memeid = this.props.memeId;
    const ref = firebase.firestore().collection("Memes").doc(memeid);
    ref.get().then(docSnapshot => {
      const data = docSnapshot.data();
      const reactCount = data.reactCount || 0;
      if (this._isMounted) {
        this.setState({ reactCount: reactCount })
      }
    });
  }

  updateReactCount(newReactCount) {
    this.setState({ reactCount: newReactCount });
  }

  render() {
      console.log('OPENING DAS TILE MIA ALTIERI');
      console.log(this.props.likedFrom);
    return (
      <View style={styles.container}>
        <TileHeader 
          uid="F5bA3qC0dkca7h1INfoNNq4GIRh2"
          sub={this.props.sub} 
          likedFrom={this.props.likedFrom} 
          poster={this.props.poster}
        />
        <Photo imageUrl={this.props.imageUrl}/>
        <ButtonBar
          imageUrl={this.props.imageUrl}
          memeId={this.props.memeId}
          imageUrl={this.props.imageUrl}
          postedBy={this.props.postedBy}
          updateReacts={this.updateReactCount}
        />
        <PostInfo
          memeId={this.props.memeId}
          reactCount={this.state.reactCount}
          imageUrl={this.props.imageUrl}
        />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
export default Tile;
