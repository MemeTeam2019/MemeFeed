import React from "react";
import firebase from 'react-native-firebase';
import {
  StyleSheet,
} from "react-native";
import Tile from '../components/image/Tile';

const user = firebase.auth().currentUser;

class TilePage extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tile
        memeId={this.props.navigation.getParam("memeId")}
        imageUrl={this.props.navigation.getParam("src")}
      />
    );
  }
}

export default TilePage;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 0,
    backgroundColor: "#ffffff"
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
})
