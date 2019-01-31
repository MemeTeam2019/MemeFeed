import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Button,
  TextInput,
  Alert,
  ImageBackground
} from 'react-native';
import firebase from 'react-native-firebase';

export default class SignupScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      username: '',
      password: '',
      cpassword: ''
    }
  }

  handleSignup = () => {
    let email = this.state.email;
    let password = this.state.password;
    if (password !== this.state.cpassword) {
      Alert.alert("Passwords don't match", ``, [{text: 'OK'}]);
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredentials) => {
      if (userCredentials !== undefined && userCredentials !== null) {
          console.log('User created successfully with uuid' + userCredentials.user);
      } else {
        console.log('???');
      }
    })
    .catch(error => {
      console.log(error.code);
    });
  }

  render() {
    return (
      <ImageBackground
        source={require('../images/bkgrnd.jpeg')}
        style={styles.background}>
        <View style={styles.container}>
          <KeyboardAvoidingView contentContainerStyle={styles.addBottomPadding} behavior='position'>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={(email) => this.setState({email: email})}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              onChangeText={(name) => this.setState({name: name})}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={(username) => this.setState({username: username})}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password: password})}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={true}
              onChangeText={(cpassword) => this.setState({cpassword: cpassword})}
            />
            <Button
              title="Submit"
              style={styles.submit}
              color= '#fff'
              onPress={() => this.handleSignup()}
            />
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '18%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fcfcfc'
  },
  title: {
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  input: {
    width: 325,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    fontSize: 18,
    marginVertical: 8,
    padding: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  submit: {
    marginTop: 15,
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%'
  }
})