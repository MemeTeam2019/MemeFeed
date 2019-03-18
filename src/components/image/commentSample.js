import React from 'react';
import {
  View,
  StyleSheet,
  FlatList
} from 'react-native';
import firebase from 'react-native-firebase';

import Comment from './comment';

class CommentSample extends React.Component{
  constructor(){
    super();
    this.unsubscribe = null;
    this.state = {
      comments: [],
    };
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const comments = [];

    querySnapshot.forEach((doc) => {
      const { text, uid, time } = doc.data();
      console.log("\n\n\n~~~~~~~~~~~"+text+" "+time+" "+"\n\n\n");

      var userRef = firebase.firestore().collection('Users').doc(uid);
      var getDoc = userRef.get()
        .then(doc => {
          if (!doc.exists) {
            console.log('No such user '+uid+' exist!');
          } else {
            const {username} = doc.data();
            comments.push({
              key: doc.id,
              doc, // DocumentSnapshot
              content: text,
              time: time,
              username: username,
            });

            // resort comments since nested asynchronous function
            function compareTime(a,b) {
              console.log("sorting comments bb")
              if (a.time < b.time)
                return -1;
              if (a.time > b.time)
                return 1;
              return 0;
            }

            sortedComments = comments.sort(compareTime);

            this.setState({
              comments: sortedComments,
            });

          }

        })
        .catch(err => {
          console.log('Error getting document', err);
        });
      

    });


  }

  componentDidMount() {
    this.unsubscribe = firebase.firestore()
      .collection("Comments/"+this.props.memeId+"/Text")
      .orderBy('time', 'desc').limit(2) // we choose decsending to get most recent
      .onSnapshot(this.onCollectionUpdate);
  }

  // componentWillUnmount() {
  //   this.unsubscribe = null
  //   this.setState({
  //     comments: []
  //   });

  // }

  //Single comment
  renderComment({item}) {
    return (
      <Comment 
        username={item.username}
        content={item.content}
        uid={item.key}
      />
    );
  }


  render(){
    return(
      <View style={styles.containerStyle}>
        <FlatList 
          data={this.state.comments}
          renderItem={this.renderComment.bind(this)}
        />
      </View>
    );  
  }
}

export default CommentSample;

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },

})