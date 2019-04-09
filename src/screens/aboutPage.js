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
          <Text style={styles.title}> Welcome to MemeFeed! </Text>
        </View>
        <View style={styles.aboutText}>
          <Text style={styles.aboutText}>
            Meme Feed is a place where you can view an endless supply
            of Memes without having to look at any family photos or
            your ex-coworkers beach photos. (We don't care about your
            Bahama beach boyfriend Sally!)
            {"\n"}
            {"\n"}
            With memes ranging in all categories, Meme Feed strives to
            provide the perfect app for meme browsing and finding other
            meme-holics like you!
          </Text>

          <Button
            title="Next"
            color='blue'
            onPress={() => this.props.navigation.push('About2')}
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
    color: 'blue',
    paddingHorizontal: '5%',
    marginBottom: '5%',
    textAlign: 'center',
    height: 300
  },
  aboutText: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    color: 'blue',
    paddingHorizontal: '3%',
    marginBottom: '3%',
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
