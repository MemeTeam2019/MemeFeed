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
          <Text style={styles.title}>Choose your Icon</Text>
        </View>

        <View style={styles.navBar}>
          <View style={styles.leftContainer}>
            <Image
            source={require('../images/userIcons/icon777.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
            </View>
          <View style={styles.middleContainer}>
            <Image
            source={require('../images/userIcons/icon666.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
          </View>
          <View style={styles.rightContainer}>
            <Image
            source={require('../images/userIcons/icon999.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
          </View>
        </View>

        <View style={styles.navBar}>
          <View style={styles.leftContainer}>
            <Image
            source={require('../images/userIcons/icon111.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
            </View>
          <View style={styles.middleContainer}>
            <Image
            source={require('../images/userIcons/icon222.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
          </View>
          <View style={styles.rightContainer}>
            <Image
            source={require('../images/userIcons/icon888.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
          </View>
        </View>

        <View style={styles.navBar}>
          <View style={styles.leftContainer}>
            <Image
            source={require('../images/userIcons/icon333.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
            </View>
          <View style={styles.middleContainer}>
            <Image
            source={require('../images/userIcons/icon444.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
          </View>
          <View style={styles.rightContainer}>
            <Image
            source={require('../images/userIcons/icon555.png')} style={{width: 100, height: 100, borderRadius: 100/2}}/>
          </View>
        </View>

        <View style={styles.nextBut}>
          <Button
            title="Next"
            color='blue'
            onPress={() => this.props.navigation.push('About')}
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
    backgroundColor: 'blue',
    marginTop: 50,
    marginBottom: 60
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
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  navBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //backgroundColor: 'blue',
    marginTop: 30,
    marginBottom: 30
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'green',
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'yellow',
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'red',
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBut: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
