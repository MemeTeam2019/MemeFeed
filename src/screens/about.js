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
  Text
} from 'react-native';


export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    return (
      <ImageBackground
        source={require('../images/bkgrnd.jpeg')}
        style={styles.background}>
      <View style={styles.container}>
      <Text style={styles.title}> About Us! </Text>
      </View>
      <View style={styles.aboutText}>
      <Text style={styles.aboutText}>
        Thanks for joining Meme Feed!
      </Text>
      <Text style={styles.aboutText}>
        Meme Feed is a place where you can view an endless supply of Memes without having to look at any family photos or your ex-coworkers beach photos. (We don't care about your Bahama beach boyfriend Sally!) With memes ranging in all categories, Meme Feed strives to provide the perfect app for meme browsing and finding other meme-holics like you!
      </Text>
      <Text style={styles.aboutText}>
        By ranking Memes you provide us with an insight into your refined meme taste. And with this insight we hope to be able to generate a feed of quality Memes just for you, making it so you will never have to mine for memes again.
      </Text>
      <Text style={styles.aboutText}>
        Meme feed is currently in Beta, so be sure to update the application to get features such as Meme upload, curated feeds, and DMing.

      </Text>
      <Text style={styles.aboutText}>
        01100100
      </Text>

      <Text style={styles.aboutText}>
        01100001
      </Text>
      <Text style={styles.aboutText}>
        01100010
      </Text>
      </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:170,
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 40,//50
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
    paddingTop: 5,//50
    paddingLeft: 5,
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
    width: '100%'
  }
});
