import React from "react";
import firebase from 'react-native-firebase';
import {
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import Tile from '../components/image/Tile';
import PostInfo from '../components/image/PostInfo';

const user = firebase.auth().currentUser;

class TilePage extends React.Component {

  constructor(props) {
    super(props);
  }


  renderTile({item}){
    //for list view
    return <Tile
      memeId={item.key}
      imageUrl={item.src}
    />
  }



  render() {
    return (
      <FlatList 
        style={styles.containerStyle}
        data={this.props.navigation.getParam("memes")}
        renderItem={this.renderTile.bind(this)}
      />
    )
  }
}

// return (
//       <View style={styles.containerStyle}>
//         <Tile
//           memeId={this.props.navigation.getParam("memeId")}
//           imageUrl={this.props.navigation.getParam("src")}
//         />
//       </View>
//     );

export default TilePage;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
})
