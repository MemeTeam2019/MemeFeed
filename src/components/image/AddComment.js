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

              onChangeText={(text) => {
                this.setState({ text })
              }}
              onContentSizeChange={(event) => {
                this.setState({ height: Math.min(120,event.nativeEvent.contentSize.height) })
              }}
              style={[styles.input, {height: Math.max(35, this.state.height)}]}
              value={this.state.text}
            >
            </TextInput>
    

           <Button
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
