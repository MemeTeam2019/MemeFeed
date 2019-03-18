import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'react-native-firebase';

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    if (user && user.emailVerified) {
      this.props.navigation.navigate('Main');
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  loading: {
    fontSize: 24,
    padding: 20,
  },
});

export default LoadingScreen;
