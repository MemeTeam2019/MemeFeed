import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Button,
  TextInput,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import firebase from 'react-native-firebase';

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.setState({
      username: '',
      password: '',
    });
  }

  handleLogin = () => {
    let email = this.state.email;
    let password = this.state.password;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        if (!user.user.emailVerified) {
          Alert.alert('Error', 'Your account is not verified.', [
            { text: 'OK' },
          ]);
          this.props.navigation.push('Confirm');
        } else {
          this.props.navigation.navigate('Main');
        }
      })
      .catch(error => {
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
        <View style={styles.container}>
          <KeyboardAvoidingView behavior="position">
            <Image style={styles.logo} source={require('../images/logo.png')} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={email => this.setState({ email: email })}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={password => this.setState({ password: password })}
            />
            <Button
              title="Log In"
              color="#fff"
              onPress={() => this.handleLogin()}
            />
            <Button
              title="Sign Up"
              color="#fff"
              onPress={() => this.props.navigation.push('Signup')}
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
  },
  title: {
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    color: '#5C5B5A',
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
});

export default LoginScreen;
