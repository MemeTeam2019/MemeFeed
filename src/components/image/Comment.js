import * as React from 'react';
import { Button, StyleSheet, View, Image, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Username from './username';
import firebase from 'react-native-firebase';
import { withNavigation } from "react-navigation";

class Comment extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      memeId: this.props.memeId,
      uid: this.props.uid,
      username: '',
    };
  }

  componentDidMount() {
    const uid = this.state.uid;
    const userRef = firebase.firestore().collection("Users").doc(uid);
    userRef.get().then(snapshot => {
      const data = snapshot.data();
      this.setState({username: data.username})
    })
    .catch(err => console.log(err));
  }

  handleUsernameClick() {
    this.props.navigation.push("FriendProfile", {
      uid: this.props.uid
    });
  }

  render() {
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.handleUsernameClick()}>
          <Text style={styles.userText}>{this.props.username}
          <TouchableWithoutFeedback>
            <Text style={styles.commentStyle}> {this.props.content} </Text>
          </TouchableWithoutFeedback>
          </Text> 
        </TouchableOpacity>
       
      </View>
    );

  }
}

export default withNavigation(Comment);


const styles = StyleSheet.create({
  container: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    flexDirection: 'row',
    marginLeft: '2.5%',
    marginRight:'2.5%',
    paddingTop: 10,
  },
  userText: {
    fontWeight: 'bold'
  },
  commentStyle: {
    fontWeight: 'normal'
  },
});
