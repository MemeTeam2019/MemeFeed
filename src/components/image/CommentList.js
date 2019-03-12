import * as React from 'react';
import firebase from 'react-native-firebase';

//import React in our project
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
  FlatList,
  Button
} from 'react-native';

//import all the needed components
import ButtonBar from './ButtonBar';
import Comment from './Comment';
import PhotoGrid from 'react-native-image-grid';

class CommentList extends React.Component{
  constructor(){
    super();
    this._isMounted= false;
    this.unsubscribe = null;
    this.state = {
      commentsLoaded: 10,
      commentCount: 0,
      comments: [],
    };
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const comments = [];

    querySnapshot.forEach((doc) => {
      const { text, uid, time } = doc.data();

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
    this._isMounted = true;
    if (this._isMounted){

      // Grab total # of comments
      var countRef = firebase.firestore().collection("Comments/"+this.props.memeId+"/Info").doc('CommentInfo');
      countRef.get().then(doc => {
        if (doc.exists) {
          const {count} = doc.data();
          this.setState({
            commentCount: count
          });

          this.unsubscribe = firebase.firestore()
            .collection("Comments/"+this.props.memeId+"/Text")
            .orderBy('time', 'desc') // we choose decsending to get most recent
            .limit(Math.min(this.state.commentCount, this.state.commentsLoaded)) // limiting the comments we load
            .onSnapshot(this.onCollectionUpdate);
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });


     
    }
  }

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
    // if there are more comments to load
    if (this.state.commentsLoaded < this.state.commentCount){
      return(
        <View style={[styles.containerStyle]}>
          <ButtonBar memeId={this.props.memeId}/>
          <Button
            onPress={() => {          
              newLoadCount = this.state.commentsLoaded + 10;
              this.setState({
                commentsLoaded: newLoadCount,
                comments: [],
              });
              this.componentDidMount();
            }}
            style={{fontSize: 1}}
            title="Load older comments"
            color='#3d97ff'
          />

          <FlatList 
            data={this.state.comments}
            renderItem={this.renderComment.bind(this)}
          />
        </View>
      );  
    } else { // no more comments to load
      return(
        <View style={[styles.containerStyle]}>
          <ButtonBar memeId={this.props.memeId}/>
          <FlatList 
            data={this.state.comments}
            renderItem={this.renderComment.bind(this)}
          />
        </View>
      );  
    }
  }
}

export default CommentList;

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 50,
    bottom: 50,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },

})