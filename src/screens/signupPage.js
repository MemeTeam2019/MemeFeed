import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Button,
  TextInput,
  Alert,
  ImageBackground,
} from 'react-native';
import firebase from 'react-native-firebase';

/**
 * Handles signing up for new accounts.
 *
 * Props
 * -----
 * None
 */
class SignupScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      username: '',
      password: '',
      cpassword: '',
    };
  }

  addUserDoc = (uid, email, name, username) => {
    firebase
      .firestore()
      .runTransaction(async (transaction) => {
        const ref = await firebase
          .firestore()
          .collection('Users')
          .doc(uid);
        const doc = await transaction.get(ref);

        if (!doc.exists) {
          transaction.set(ref, {
            email: email.toLowerCase(),
            name,
            searchableName: name.toLowerCase(),
            username,
            searchableusername: username.toLowerCase(),
            followersCnt: 0,
            followingCnt: 0,
            followersLst: [],
            followingLst: [],
          });
          return uid;
        }
      })
      .then((uid) => {
        console.log('User doc successfully set for user with ' + uid);
      })
      .catch((err) => {
        Alert.alert('Signup Error', 'Error creating User doc for' + email, [
          { text: 'OK', style: 'cancel' },
        ]);
      });
  };

  handleSubmit = () => {
    const email = this.state.email;
    const name = this.state.name;
    const username = this.state.username;
    const password = this.state.password;
    if (password !== this.state.cpassword) {
      Alert.alert("Passwords don't match", '', [{ text: 'OK' }]);
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          const uid = user.user.uid;
          this.addUserDoc(uid, email, name, username);
          this.props.navigation.push('Icon');
        } else {
          Alert.alert('Error', "Couldn't create acount. Please try again", [
            { text: 'OK' },
          ]);
        }
      })
      .catch((error) => {
        Alert.alert('Error', error.code, [
          { text: 'OK', onPress: () => this.props.navigation.popToTop() },
        ]);
      });
  };

  render() {
    return (
      <ImageBackground
        source={require('../images/bkgrnd.jpeg')}
        style={styles.background}
      >
        <View style={styles.container}>
          <KeyboardAvoidingView
            contentContainerStyle={styles.addBottomPadding}
            behavior='position'
          >
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
              style={styles.input}
              placeholder='Email'
              onChangeText={(email) => this.setState({ email })}
              autoComplete='email'
              autoCapitalize='none'
            />
            <TextInput
              style={styles.input}
              placeholder='Name'
              onChangeText={(name) => this.setState({ name })}
              autoComplete='name'
            />
            <TextInput
              style={styles.input}
              placeholder='Username'
              onChangeText={(username) => this.setState({ username })}
              autoComplete='username'
            />
            <TextInput
              style={styles.input}
              placeholder='Password'
              secureTextEntry
              onChangeText={(password) => this.setState({ password })}
              autoComplete='password'
            />
            <TextInput
              style={styles.input}
              placeholder='Confirm Password'
              secureTextEntry
              onChangeText={(cpassword) => this.setState({ cpassword })}
            />
            <Button
              title='Submit'
              style={styles.submit}
              color='#fff'
              onPress={() => this.handleSubmit()}
            />
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    );
  }
}

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '18%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    color: '#FFFFFF',
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
      width: 1,
    },
  },
  submit: {
    marginTop: 15,
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
