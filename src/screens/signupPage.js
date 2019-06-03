import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import firebase from 'react-native-firebase';
import { CheckBox } from 'react-native-elements';

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
      checked: false,
      uploading: false,
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
        }
        this.setState({ uploading: false });
      })
      .then(() => this.props.navigation.push('Icon'))
      .catch(() => {
        this.setState({ uploading: false });
        Alert.alert('Signup Error', `Error creating User doc for ${email}`, [
          { text: 'OK', style: 'cancel' },
        ]);
      });
  };

  handleSubmit = () => {
    this.setState({ uploading:true });
    const email = this.state.email;
    const name = this.state.name;
    const username = this.state.username;
    const password = this.state.password;
    if (password !== this.state.cpassword) {
      Alert.alert("Passwords don't match", '', [{ text: 'OK' }]);
      return;
    }
    if (email === '' || password === '' || name === '' || username === '') {
      Alert.alert('Error', 'Enter in all information', [{ text: 'OK' }]);
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          const uid = user.user.uid;
          this.addUserDoc(uid, email, name, username);
        } else {
          this.setState({ uploading: false });
          Alert.alert(
            'Signup Error',
            "Couldn't create acount. Please try again",
            [{ text: 'OK' }]
          );
        }
      })
      .catch((error) => {
        this.setState({ uploading: false });
        Alert.alert('Error', error.code, [
          {
            text: 'Dismiss',
            style: 'cancel',
          },
        ]);
      });
  };

  render() {
    return (
      <ImageBackground
        source={require('../images/bkgrnd.jpeg')}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? null : 'padding'}
          style={styles.container}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              // marginTop: '25%',
            }}
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
            <CheckBox
              center
              title='Accept Privacy Policy'
              checkedColor='white'
              checked={this.state.checked}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
              onPress={() => {
                const checked = this.state.checked;
                this.setState({ checked: !checked });
              }}
            />
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Privacy')}
              style={styles.privacyText}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: 'white',
                  marginTop: 5,
                  marginBottom: 5,
                }}
              >
                Read Privacy Policy
              </Text>
            </TouchableOpacity>

            { !this.state.uploading &&  this.state.checked &&
              <TouchableOpacity
                onPress={() => this.handleSubmit()}
                style={styles.button}
                disabled={false}
              >
                <Text style={styles.button}>Submit </Text>
              </TouchableOpacity>
            }
            { !this.state.uploading && !this.state.checked &&
              <TouchableOpacity
                onPress={() => this.handleSubmit()}
                style={styles.disabledButton}
                disabled={true}
              >
                <Text style={styles.disabledButton}>Submit </Text>
              </TouchableOpacity>
            }
            { this.state.uploading &&
              <ActivityIndicator
                color="white"
              />
            }
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

export default SignupScreen;

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
    color: '#FFFFFF',
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
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
  },
  checkboxText: {
    fontFamily: 'AvenirNext-Regular',
    fontWeight: 'normal',
    fontSize: 18,
    color: 'white',
  },
  submit: {
    marginTop: 15,
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  privacyText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    marginBottom: 3,
  },
  disabledButton: {
    backgroundColor: 'transparent',
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    fontSize: 20,
    color: '#CDCDCD',
    marginBottom: 3,
  },
});
