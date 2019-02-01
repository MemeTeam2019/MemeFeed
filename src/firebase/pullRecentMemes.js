import firebase from 'react-native-firebase';

const ref = firebase.firestore().collection('cities').doc('London');


// export const getRecentMemes = () => {
//    firebase.auth().signInWithEmailAndPassword(email, password)
//     .then(userCredentials => {
//       if (typeof userCredentials !== undefined) {
//         return userCredentials.user;
//       } else {
//         return 'Error: null user';
//       }
//     })
//     .catch(error => {
//       console.log(error.code);
//       return error.code;
//     });
// }