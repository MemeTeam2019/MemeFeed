import React from 'react';
import { StyleSheet, View, Button, ImageBackground, Image, Text } from 'react-native';

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
          <Text style={styles.title}> Reactions</Text>
        </View>
        <View style={styles.aboutText}>
          <Text style={styles.aboutText}>
            React to Memes using each of these 5 reactions. A meme scoring any
            of the happy faces will make it to your profile page for you to enjoy
            later or for your friends and followers.
          </Text>
          <View style={{flex: 0, flexDirection: 'row',     paddingRight: 2,
              paddingHorizontal: 25,}}>
            <Image
              source={require('../images/Tile/button0.png')}
              style={{ width: 50, height: 50}}
            />
            <Image
              source={require('../images/Tile/button1.png')}
              style={{ width: 50, height: 50, paddingHorizontal: 20,}}
            />
            <Image
              source={require('../images/Tile/button2.png')}
              style={{ width: 50, height: 50, paddingHorizontal: 20,}}
            />
            <Image
              source={require('../images/Tile/button3.png')}
              style={{ width: 50, height: 50, paddingHorizontal: 20,}}
            />
            <Image
              source={require('../images/Tile/button4.png')}
              style={{ width: 50, height: 50, paddingHorizontal: 20,}}
            />
          </View>
          <Button
            title="Next"
            color='blue'
            style={{paddingTop: 30}}
            onPress={() => this.props.navigation.push('About3')}
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
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    color: 'blue',
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
  images: {
    flex: 1,
    height: '10%',
    width: '10%',
  }
});
