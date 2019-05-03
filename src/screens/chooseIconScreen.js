import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';

import firebase from 'react-native-firebase';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor() {
    super();
    this.state = {
      selectedIcon: false,
      icon: '',
    };
    this.iconImages = {
      1: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon777.png?alt=media&token=715029a5-662d-4a5b-ab03-6d677fd63697',
      2: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon666.png?alt=media&token=86089f45-4d4d-4604-b6e8-fa1d30269549',
      3: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon999.png?alt=media&token=bf35e542-6e1e-4b8a-bc6a-5ebe30fd28a3',
      4: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon111.png?alt=media&token=a826c2e3-b017-4572-920b-4acc2cf59adb',
      5: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon222.png?alt=media&token=a53771f0-13ce-4aed-93b9-d8067dcb68b4',
      6: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon888.png?alt=media&token=05558df6-bd5b-4da1-9cce-435a419347a0',
      7: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon333.png?alt=media&token=5b8a4b01-e0cb-46b9-89e2-5e9a5e0757f1',
      8: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon444.png?alt=media&token=5b36786a-2c7b-4bf9-8556-6e41e9bf621b',
      9: 'https://firebasestorage.googleapis.com/v0/b/memefeed-6b0e1.appspot.com/o/UserIcons%2Ficon555.png?alt=media&token=48fb9bf8-4efb-490c-a178-13a9efb2289c',
    };
  }

  _onPressButton = async (newIcon) => {
    const oldIcon = this.state.selectedIcon;
    this.setState({
      selectedIcon: newIcon === oldIcon ? false : newIcon,
      icon: newIcon,
    });
    firebase
      .firestore()
      .collection('Users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        icon: this.iconImages[newIcon],
      });
  };

  _onNextButton = async () => {
    this.props.navigation.push('About');
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
            <TouchableOpacity onPress={this._onPressButton.bind(this, 1)}>
              <Image
                source={
                  this.state.selectedIcon === 1 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon777.png')
                    : require('../images/userIcons/iconG7.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 2)}>
              <Image
                source={
                  this.state.selectedIcon === 2 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon666.png')
                    : require('../images/userIcons/iconG6.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 3)}>
              <Image
                source={
                  this.state.selectedIcon === 3 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon999.png')
                    : require('../images/userIcons/iconG9.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.navBar}>
          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 4)}>
              <Image
                source={
                  this.state.selectedIcon === 4 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon111.png')
                    : require('../images/userIcons/iconG1.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 5)}>
              <Image
                source={
                  this.state.selectedIcon === 5 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon222.png')
                    : require('../images/userIcons/iconG2.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 6)}>
              <Image
                source={
                  this.state.selectedIcon === 6 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon888.png')
                    : require('../images/userIcons/iconG8.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.navBar}>
          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 7)}>
              <Image
                source={
                  this.state.selectedIcon === 7 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon333.png')
                    : require('../images/userIcons/iconG3.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 8)}>
              <Image
                source={
                  this.state.selectedIcon === 8 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon444.png')
                    : require('../images/userIcons/iconG4.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 9)}>
              <Image
                source={
                  this.state.selectedIcon === 9 ||
                  this.state.selectedIcon === false
                    ? require('../images/userIcons/icon555.png')
                    : require('../images/userIcons/iconG5.png')
                }
                style={{ width: 80, height: 80, borderRadius: 80 / 2 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.nextBut}>
          <Button
            title='Next'
            color='#000'
            onPress={this._onNextButton.bind()}
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
    marginTop: '20%',
    marginBottom: '3%',
  },
  title: {
    fontSize: 35,
    fontFamily: 'AvenirNext-Regular',
    //color: '#9F02FF',
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
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    //color: '#9F02FF',
    paddingHorizontal: '3%',
    marginBottom: '3%',
    paddingRight: 5,
    paddingTop: 5, //50
    paddingLeft: 5,
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
    marginTop: '7%',
    marginBottom: '7%',
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    //backgroundColor: 'green',
    marginLeft: 20,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '5%',
  },
});
