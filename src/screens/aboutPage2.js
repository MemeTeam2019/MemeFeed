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
          <Text style={styles.title}>Reactions</Text>
        </View>

        <View style={styles.aboutText}>
          <Text style={styles.aboutText}>
            React to Memes using each of these 5 emojis.
             When you rank a meme with any of the smiling
              emoji's it will appear on your profile
              and on your followers' home feed
          </Text>
          </View>

          <View style={{flex: 0, flexDirection: 'row',     paddingRight: 2,
              paddingHorizontal: 25,}}>
            <Image
              source={require('../images/Tile/buttonBar.png')}
              style={{ width: '100%', height: '10%', alignItems: 'center', justifyContent: 'center'}}
            />
          </View>

        <View style={styles.nextBut}>
          <Button
            title="Next"
            color='#9F02FF'
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
    height: 100,
    elevation: 10,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingLeft: 3,
    paddingTop: 10, //50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    //backgroundColor: 'blue',
    marginTop: '20%',
    marginBottom: '3%'
  },
  title: {
    fontSize: 35,
    fontFamily: 'AvenirNext-Regular',
    color: '#9F02FF',
    paddingHorizontal: '5%',
    marginBottom: '1%',
    textAlign: 'center',
    height: 70,
    //backgroundColor: 'red'
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.4,
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    color: '#9F02FF',
    paddingHorizontal: '3%',
    marginBottom: '3%',
    textAlign: 'center',
    paddingRight: 5,
    paddingTop: 5, //50
    paddingLeft: 5,
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
  },
  nextBut: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '5%',
  }
});
