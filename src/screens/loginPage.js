import React from 'react';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Button,
  TextInput,
  Alert,
  ImageBackground,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  Text
} from 'react-native';
import firebase from 'react-native-firebase';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.setState({
      password: '',
    });
  }

  handleLogin = () => {
    const email = this.state.email;
    const password = this.state.password;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (!user.user.emailVerified) {
          Alert.alert('Error', 'Your account is not verified.', [
            {
              text: 'Resend verification',
              onPress: () => user.user.sendEmailVerification(),
            },
            { text: 'OK' },
          ]);
        } else {
          this.props.navigation.navigate('Main');
        }
      })
      .catch((error) => {
        let errorMessage = 'An error occured';
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Email is disabled';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Email not registered';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Wrong email or password';
            break;
          default:
            errorMessage =
              'Something went wrong, please contact memefeedaye@gmail.com';
            break;
        }
        Alert.alert('Login Failed', errorMessage, [{ text: 'OK' }]);
      });
  };

  render() {
    return (
      <ImageBackground
        source={require('../images/bkgrnd.jpeg')}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior='padding'
          style={styles.container}
          keyboardVerticalOffset={0}
        >
          <ScrollView contentContainerStyle={styles.container}>
            <Image style={styles.logo} source={require('../images/logo.png')} />
            <TextInput
              style={styles.input}
              placeholder='Email'
              onChangeText={(email) => this.setState({ email })}
              autoCapitalize='none'
            />
            <TextInput
              style={styles.input}
              placeholder='Password'
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
            />
            <TouchableOpacity onPress={() => this.handleLogin()}
                              style={styles.button} >
              <Text style={styles.button}>Log In </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.push('Signup')}
                              style={styles.button} >
              <Text style={styles.button}>Sign Up </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  title: {
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    color: '#5C5B5A',
  },
  input: {
    width: Dimensions.get('window').width * 0.85,
    height: 50,
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
      width: 1,
    },
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  logo: {
    width: 250,
    height: 125,
    borderRadius: 5,
    paddingHorizontal: 15,
    margin: '5%',
  },
  button: {
    backgroundColor: 'transparent',
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff'
  }
});

export default LoginScreen;
