import React from 'react';
import { StyleSheet, View, Button, ImageBackground, Text } from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <ImageBackground
        source={require('../images/white.png')}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.title}>MemeFeed</Text>
        </View>
        <View style={styles.aboutText}>
          <Text style={styles.aboutText}>
            Meme Feed is a place where you can view an endless supply of memes
            without having to look at any family photos or your ex-coworkers
            beach photos. (We don't care about your Bahama beach boyfriend
            Sally!)
          </Text>
          <Text style={styles.aboutText}>
            With memes ranging in all categories, Meme Feed strives to provide
            the perfect app for meme browsing and finding other meme-holics like
            you!
          </Text>
        </View>

        <View style={styles.nextBut}>
          <Button
            title='Next'
            color='#9F02FF'
            onPress={() => this.props.navigation.push('aboutInfo2')}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    elevation: 10,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingLeft: 3,
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    marginTop: '25%',
  },
  title: {
    fontSize: 35,
    fontFamily: 'AvenirNext-Regular',
    color: '#9F02FF',
    paddingHorizontal: '5%',
    marginBottom: '0.5%',
    textAlign: 'center',
    height: 50,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.4,
  },
  aboutText: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    color: '#9F02FF',
    paddingHorizontal: '4%',
    marginBottom: '1%',
    paddingRight: 5,
    paddingLeft: 5,
    marginLeft: '3%',
    marginRight: '3%',
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
  nextBut: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '5%',
  },
});
