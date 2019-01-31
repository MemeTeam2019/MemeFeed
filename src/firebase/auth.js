import {AsyncStorage} from 'react-native';
import firebase from 'react-native-firebase';

/**
 * Check credentials of the user using firebase api
 * If the user has correct credentials, set signedIn state
 * to true.
 * @returns true if authentication successful, false otherwise
 */
export const authenticate = (email, password) => {
   firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredentials => {
      if (typeof userCredentials !== undefined) {
        return userCredentials.user;
      } else {
        return 'Error: null user';
      }
    })
    .catch(error => {
      console.log(error.code);
      return error.code;
    });
}

export const signOut = () => {
  AsyncStorage.setItem('signedIn', 'false');
}

export const isSignedIn = async () => {
  try {
    const signedIn = await AsyncStorage.getItem('signedIn');
    if (signedIn !== null && signedIn == 'true') {
      return true;
    } else {
      return false;
    }
  } catch(error) {
      return false;
  }
}
