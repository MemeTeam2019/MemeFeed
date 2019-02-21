import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';

import ButtonBar from './ButtonBar';
import Photo from './Photo';
import TileHeader from './TileHeader';
import PostInfo from './PostInfo';

import firebase from "react-native-firebase";

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reactCount: 0,
    }
    this.updateReactCount = this.updateReactCount.bind(this);
  }

  componentDidMount() {
    this.getNumReaction();
  }

  getNumReaction() {
    const memeid = this.props.memeId;
    const ref = firebase.firestore().collection("Memes").doc(memeid)
  
    ref.get().then(docSnapshot => {
        const data = docSnapshot.data();
        console.log(data);
        const reactCount = data.reactCount || 0;
        this.setState({reactCount: reactCount})
    })
  }

  updateReactCount(newReactCount) {
    console.log(newReactCount);
    this.setState({ reactCount: newReactCount });
  }

  render() {
    return ( 
      <View style={styles.container}>
        <TileHeader/>
        <Photo imageUrl={this.props.imageUrl}/>
        <ButtonBar
          memeId={this.props.memeId}
          updateReacts={this.updateReactCount}
        />
        <PostInfo
          memeId={this.props.memeId}
          reactCount={this.state.reactCount}
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
 

