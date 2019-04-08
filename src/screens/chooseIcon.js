import React from 'react';
import { StyleSheet, View, Button, ImageBackground, Image, Text } from 'react-native';

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
          <Text style={styles.title}>Choose your Icon</Text>
        </View>
        <View style={styles.imageSpace}>
          <Image
            source={require('../images/userIcons/icon1.png')}
            style={{ width: '35%', height: '35%', marginRight: 20}}
          />
        </View>
        <View style={styles.nextBut}>
          <Button
            title="Next"
            color="#fff"
            onPress={() => this.props.navigation.push('About')}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 170,
    elevation: 5,
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
    backgroundColor: 'blue',
    marginTop: 1
  },
  title: {
    fontSize: 40,
    fontFamily: 'AvenirNext-Regular',
    color: 'white',
    paddingHorizontal: '5%',
    marginBottom: '5%',
    textAlign: 'center',
    height: 70,
    backgroundColor: 'red'
  },
  aboutText: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    color: 'white',
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
  imageSpace: {
    backgroundColor: 'green',
    marginTop: 7,
    marginLeft: 7,
    marginRight: 7,
    flex: 0,
    paddingRight: 2,
    paddingHorizontal: 25,
  },
  nextBut: {
    backgroundColor: 'orange',
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    marginTop: 7,
    marginLeft: 7,
    marginRight: 7,
    marginBottom: 20
  }
});
