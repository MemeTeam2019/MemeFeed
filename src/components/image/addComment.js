import React from 'react';
import { StyleSheet, View, Button, TextInput, Keyboard, TouchableOpacity, Text } from 'react-native';
import firebase from 'react-native-firebase';

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this._onPressButton = this._onPressButton.bind(this);
    this.state = {
      height: 0,
      text: ''
    };
  }

  _onPressButton = () => {
    const user = firebase.auth().currentUser;
    const date = Math.round(+new Date() / 1000);
    const memeId = this.props.memeId;

    const countRef = firebase
      .firestore()
      .collection(`CommentsTest/${memeId}/Info`)
      .doc('CommentInfo');
    countRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          countRef.set(
            {
              count: 1,
            },
            { merge: true }
          );
        } else {
          const { count } = doc.data();
          countRef.set(
            {
              count: count + 1,
            },
            { merge: true }
          );
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });

    const ref = firebase.firestore().collection(`CommentsTest/${memeId}/Text`);

    ref
      .get()
      .then((doc) => {
        if (!doc.exists) {
          // Add necessary infrastruction
          firebase
            .firestore()
            .collection('CommentsTest')
            .doc(memeId);
          firebase
            .firestore()
            .collection('CommentsTest')
            .doc(memeId)
            .collection('Text');
        }

        // Add this comment to the proper folder
        firebase
          .firestore()
          .collection(`CommentsTest/${memeId}/Text`)
          .add({
            uid: user.uid,
            text: this.state.text.trim(),
            time: date,
          })
          .then((commentRef) => {
            this.setState({
              text: '',
            });
            console.log(this.props);
            this.props.handleNewComment(commentRef);
            console.log('Added document with ID: ', commentRef.id);
          });
        console.log('Document data:', doc.data());
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
    Keyboard.dismiss();
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          { height: Math.max(35, this.state.height) + 10 },
        ]}
      >
        <TextInput
          {...this.props}
          multiline
          placeholder='Add a comment...'
          autoCapitalize='none'
          onChangeText={(text) => this.setState({ text })}
          onContentSizeChange={(event) => {
            this.setState({
              height: Math.min(120, event.nativeEvent.contentSize.height),
            });
          }}
          style={[styles.input, { height: Math.max(35, this.state.height) }]}
          value={this.state.text}
        />

        <TouchableOpacity onPress={this._onPressButton}
            style={{backgroundColor: 'transparent',
                fontFamily: 'AvenirNext-Regular',
                textAlign: 'center',
                fontSize: 20,
                color: 'black',
                marginBottom: 3,
                height: Math.max(35, this.state.height),
                justifyContent: 'center',
                marginLeft: 10,
                marginTop: 3}}

            disabled={!this.state.text.trim()} >
            <Text style={styles.button}>Post </Text>
        </TouchableOpacity>
      </View>
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
    bottom: 0,
  },
  input: {
    width: '80%',
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginLeft: '3%',
    fontSize: 18,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  button: {
    backgroundColor: 'transparent',
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: 'black',
    marginBottom: 3,
    height: 35,
    justifyContent: 'center'
    //height: Math.max(35, this.state.height),
  }
});
