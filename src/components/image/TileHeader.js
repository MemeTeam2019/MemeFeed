import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';
 
class TileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "jonchong"
    }
  }

  componentWillMount() {
    const uid = this.props.uid;
    const userRef = firebase.firestore().collection("Users").doc(uid);
    userRef.get().then(snapshot => {
      const data = snapshot.data();
      this.setState({username: data.username})
    })
  }

  navigateToFriendProfile() {
    this.props.navigation.navigate("FriendProfile", {
      uid: this.props.uid
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={styles.userImg}
          source={{uri:'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'}}
        />
        <TouchableOpacity
          onPress={() => this.navigateToFriendProfile()}
          uid={this.props.uid}
        >
          <Text style={styles.text}>{this.state.username}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(TileHeader);
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 30
  },
  text: { 
    fontWeight: 'bold', 
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: 10
  },
  userImg: {
    width: 40,
    height: 40,
    borderRadius: 20
  }
});












