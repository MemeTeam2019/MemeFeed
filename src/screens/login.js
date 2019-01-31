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

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      this.setState({user: user})
    });
  }

  handleLogin = () => {
    let email = this.state.email;
    let password = this.state.password;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        if (typeof user !== undefined && user !== null) {
          this.props.navigation.navigate('Main');
        } else {
          console.log("yikes");
        }
      })
      .catch(error => {
        let errorMessage = "";
        switch(error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email";
            break;
          case "auth/user-disabled":
            errorMessage = "Email is disabled";
            break;
          case "auth/user-not-found":
            errorMessage = "Email not registered";
            break;
          case "auth/wrong-password":
            errorMessage = "Wrong email or password";
            break;
        }
        Alert.alert("Login Failed", errorMessage, [{text: 'OK'}])
      });
  }

  handleSignup() {
    this.props.navigation.push('Signup', {name:this.state.email});
  }

  render() {
    return (
      <ImageBackground 
        source={require('../images/background.jpeg')}
        style={styles.background}>
      <View style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          {/* <Text style={styles.title}>MEME FEED</Text> */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(email) => this.setState({email: email})}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({password: password})}
          />
          <Button
            title="Log In"
            color='#fff'
            onPress={() => this.handleLogin()}
          />
          <Button
            title="Sign Up"
            color='#fff'
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
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#FCB103'
  },
  title: {
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    color: '#5C5B5A'
  },
  input: {
    height: 55,
    width: 325,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    margin: '5%',
    fontSize: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%'
  }
});
