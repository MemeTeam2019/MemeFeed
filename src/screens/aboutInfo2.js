import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  ImageBackground,
  Image,
  Text,
  Dimensions,
} from 'react-native';

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
          <Text style={styles.title}>Reactions</Text>
        </View>

        <View style={styles.aboutText}>
          <Text style={styles.aboutText}>
            React to Memes using each of these 5 emojis ranging from LAME to
            LMFAO.
          </Text>
          <Text style={styles.aboutText}>
            When you rank a meme with any of the smiling emoji's it will appear
            on your profile and on your followers' home feed.
          </Text>
        </View>

        <View style={styles.buttonBar}>
          <Image
            source={require('../images/Tile/buttonBar.png')}
            style={{ alignSelf: 'stretch', width: win.width, height: '40.5%' }}
          />
        </View>

        <View style={styles.nextBut}>
          <Button
            title="Done"
            color='#9F02FF'
            onPress={() => this.props.navigation.push('Profile')}
          />
        </View>
      </ImageBackground>
    );
  }
}

const win = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    height: 100,
    elevation: 10,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingLeft: 3,
    paddingTop: 10,
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
    paddingTop: 1,
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
  buttonBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '1%',
    marginLeft: '1%',
  },
});
