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
  FlatList
} from 'react-native';

//import all the needed components
import ButtonBar from './ButtonBar';
import Comment from './Comment';
import PhotoGrid from 'react-native-image-grid';

class CommentList extends React.Component{
  constructor(){
    super();
    this.unsubscribe = null;
    this.state = {
      comments: [],
    };
  }

        // db.collection('conversations').where('parent_id', '==', payload)
        // .onSnapshot({includeMetadataChanges: true}, (snapshot) => {
        //     snapshot.docChanges().forEach(change => {
        //         if (change.type === 'added') {
        //             commit('pushToConversationList', change.doc)
        //         }
        //         if (change.type === 'modified') {
        //             // modified can mean require reordering of list,
        //             // if a new message comes from a different person
        //         }
        //     })
        //   })



    // console.log(querySnapshot)
    // console.log(querySnapshot._changes)
    // console.log(querySnapshot._changes[0]._type)
    // if(querySnapshot._changes[0]._type == "modified" || querySnapshot._changes[0]._type == "added") 


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
      .orderBy('time', 'desc').limit(10) // we choose decsending to get most recent
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
      />
    );
  }


  render(){
    return(
      <View style={styles.containerStyle}>
      

          <ButtonBar memeId={this.props.memeId}/>
                  {/* List of Comments */}
        <FlatList 
          data={this.state.comments}
          renderItem={this.renderComment.bind(this)}
        />
      </View>
    );  
  }
}

export default CommentList;

const styles = StyleSheet.create({
  containerStyle: {
    bottom: 50,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },

})