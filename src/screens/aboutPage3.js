import React from 'react';
import { StyleSheet, View, Button, ImageBackground, Text } from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <ImageBackground
        source={require('../images/bkgrnd.jpeg')}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>New Update Coming Soon!</Text>
        </View>
        <View style={styles.aboutText}>
          <Text style={styles.aboutText}>
          Meme feed is currently in Beta, so be sure to update the application
          to get features such as Meme upload, curated feeds, and DMing.

          </Text>
          <Button
            title="Let's Get Started"
            color="#fff"
            onPress={() => this.props.navigation.push('Confirm')}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 170,
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 40, //50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
  },
  title: {
    fontSize: 50,
    fontFamily: 'AvenirNext-Regular',
    color: 'white',
    paddingHorizontal: '5%',
    marginBottom: '5%',
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    color: 'white',
    paddingHorizontal: '3%',
    marginBottom: '3%',
    textAlign: 'center',
    paddingRight: 5,
    paddingTop: 5, //50
    paddingLeft: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.4,
  },
  input: {
    height: '12%',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: '5%',
    marginBottom: '5%',
    fontSize: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
