import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Button,
  TextInput,
  Alert,
  ImageBackground,
  Image
} from 'react-native';
import firebase from 'react-native-firebase';


class AddComment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: '', 
      height: 0
    };
  }

  _onPressButton = (content, memeId) => {
    const user = firebase.auth().currentUser;
    console.log("user "+user.uid+" commented ==============")
    const date = Math.round(+new Date()/1000);




    var countRef = firebase.firestore().collection("Comments/"+memeId+"/Info").doc('CommentInfo');
    var getDoc = countRef.get()
      .then(doc => {
        if (!doc.exists) {

          countRef.set({
            count: 1
          }, {merge: true});

        } else {

          const {count} = doc.data();
          newCount = count + 1

          countRef.set({
            count: newCount
          }, {merge: true});

        }
    
    })
    .catch(err => {
      console.log('Error getting document', err);
    });


    var ref = firebase.firestore().collection("Comments/"+memeId+"/Text")

    var getDoc = ref.get()
      .then(doc => {
        if (!doc.exists) {
          // Add necessary infrastruction
          firebase.firestore().collection("Comments").doc(memeId);
          firebase.firestore().collection("Comments").doc(memeId).collection("Text");
        }

        // Add this comment to the proper folder
        firebase.firestore().collection("Comments/"+memeId+"/Text").add({
          uid: user.uid,
          text: this.state.text,
          time: date
        }).then(ref => {
          this.setState({
            text: "",
          });
          console.log('Added document with ID: ', ref.id);
        });
        console.log('Document data:', doc.data());
        
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={{position: 'absolute', left: 0, right: 0, bottom: 0}} behavior="position">
        <View style={styles.container}>

            <TextInput
              {...this.props}
              multiline={true}

              placeholder="Add a comment..."
              onChangeText={email => this.setState({email: email})}
              autoCapitalize="none"

              onChangeText={(text) => this.setState({text})}

              onContentSizeChange={(event) => {
                this.setState({ height: Math.min(120,event.nativeEvent.contentSize.height) })
              }}
              style={[styles.input, {height: Math.max(35, this.state.height)}]}
              value={this.state.text}
            >
            </TextInput>
    

           <Button
              onPress={this._onPressButton.bind(this,this.state.text, this.props.memeId)}
              style={[styles.postButton, {height: Math.max(35, this.state.height)}]}
              title="Post"
              color='#000'
            />

        </View>
      </KeyboardAvoidingView>

    );
  }
}

 
        

export default AddComment; 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    width: '100%', 
    flex: 1,
    position: 'absolute',
    backgroundColor: '#fff',
    bottom:10
  },
  postButton: {

  },
  input: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginLeft: '3%',
    fontSize: 18,
    borderWidth: 0.5,
    borderColor: '#d6d7da',

  },
});


    //   var addDoc = firebase.firestore().collection("Comments").doc(this.props.memeId)
    //               .collection("Text").add({
    //   uid: user.uid,
    //   text: this.state.text,
    //   time: date
    // }).then(ref => {
    //   this.setState({
    //     text: "",
    //   });
    //   console.log('Added document with ID: ', ref.id);
    // });
