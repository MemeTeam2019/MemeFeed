import React from 'react';
import { StyleSheet, View, Button, ImageBackground, TouchableOpacity, Image, Text } from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(){
    super();
    this.state = {
      selected1: false,
      selected2: false,
      selected3: false,
      selected4: false,
      selected5: false,
      selected6: false,
      selected7: false,
      selected8: false,
      selected9: false,
    };
  };

  choose1 = () => {
    this.setState({
      selected1: false,
      selected2: true,
      selected3: true,
      selected4: true,
      selected5: true,
      selected6: true,
      selected7: true,
      selected8: true,
      selected9: true,
    });
  };

  choose2 = () => {
    this.setState({
      selected1: true,
      selected2: false,
      selected3: true,
      selected4: true,
      selected5: true,
      selected6: true,
      selected7: true,
      selected8: true,
      selected9: true,
    });
  };

  choose3 = () => {
    this.setState({
      selected1: true,
      selected2: true,
      selected3: false,
      selected4: true,
      selected5: true,
      selected6: true,
      selected7: true,
      selected8: true,
      selected9: true,
    });
  };

  choose4 = () => {
    this.setState({
      selected1: true,
      selected2: true,
      selected3: true,
      selected4: false,
      selected5: true,
      selected6: true,
      selected7: true,
      selected8: true,
      selected9: true,
    });
  };

  choose5 = () => {
    this.setState({
      selected1: true,
      selected2: true,
      selected3: true,
      selected4: true,
      selected5: false,
      selected6: true,
      selected7: true,
      selected8: true,
      selected9: true,
    });
  };

  choose6 = () => {
    this.setState({
      selected1: true,
      selected2: true,
      selected3: true,
      selected4: true,
      selected5: true,
      selected6: false,
      selected7: true,
      selected8: true,
      selected9: true,
    });
  };

  choose7 = () => {
    this.setState({
      selected1: true,
      selected2: true,
      selected3: true,
      selected4: true,
      selected5: true,
      selected6: true,
      selected7: false,
      selected8: true,
      selected9: true,
    });
  };

  choose8 = () => {
    this.setState({
      selected1: true,
      selected2: true,
      selected3: true,
      selected4: true,
      selected5: true,
      selected6: true,
      selected7: true,
      selected8: false,
      selected9: true,
    });
  };

  choose9 = () => {
    this.setState({
      selected1: true,
      selected2: true,
      selected3: true,
      selected4: true,
      selected5: true,
      selected6: true,
      selected7: true,
      selected8: true,
      selected9: false,
    });
  };

  render() {
    return (
      <ImageBackground
        source={require('../images/white.png')}
        style={styles.background}>

        <View style={styles.container}>
          <Text style={styles.title}>Choose your Icon</Text>
        </View>

        <View style={styles.navBar}>

          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={() => this.choose1()}>
              <Image
                source={require('../images/userIcons/icon777.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected1 ? 0.3 : 1}}
              />
            </TouchableOpacity>
            </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={() => this.choose2()}>
              <Image
                source={require('../images/userIcons/icon666.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected2 ? 0.3 : 1}}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={() => this.choose3()}>
              <Image
                source={require('../images/userIcons/icon999.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected3 ? 0.3 : 1}}
              />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.navBar}>

          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={() => this.choose4()}>
              <Image
                source={require('../images/userIcons/icon111.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected4 ? 0.3 : 1}}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={() => this.choose5()}>
              <Image
                source={require('../images/userIcons/icon222.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected5 ? 0.3 : 1}}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={() => this.choose6()}>
              <Image
                source={require('../images/userIcons/icon888.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected6 ? 0.3 : 1}}
              />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.navBar}>

          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={() => this.choose7()}>
              <Image
                source={require('../images/userIcons/icon333.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected7 ? 0.3 : 1}}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={() => this.choose8()}>
              <Image
                source={require('../images/userIcons/icon444.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected8 ? 0.3 : 1}}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={() => this.choose9()}>
              <Image
                source={require('../images/userIcons/icon555.png')}
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        opacity: this.state.selected9 ? 0.3 : 1}}
              />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.nextBut}>
          <Button
            title="Next"
            color='#9F02FF'
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
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    color: '#9F02FF',
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
    marginBottom: '7%'
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '5%',
  }
});
