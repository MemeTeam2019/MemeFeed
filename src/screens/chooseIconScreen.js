import React from 'react';
import { StyleSheet, View, Button, ImageBackground, TouchableOpacity, Image, Text } from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(){
    super();
    this.state = {
      selectedIcon: false,
    }
  };

  _onPressButton = async (newIcon) => {
    const oldIcon = this.state.selectedIcon;
    this.setState({
      selectedIcon: newIcon === oldIcon ? false : newIcon,
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
            <TouchableOpacity onPress={this._onPressButton.bind(this, 1)}>
              <Image
                source={this.state.selectedIcon === 1 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon777.png')
                        : require('../images/userIcons/iconG7.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
              />
            </TouchableOpacity>
            </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 2)}>
              <Image
                source={this.state.selectedIcon === 2 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon666.png')
                        : require('../images/userIcons/iconG6.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 3)}>
              <Image
                source={this.state.selectedIcon === 3 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon999.png')
                        : require('../images/userIcons/iconG9.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
              />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.navBar}>

          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 4)}>
              <Image
                source={this.state.selectedIcon === 4 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon111.png')
                        : require('../images/userIcons/iconG1.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 5)}>
              <Image
                source={this.state.selectedIcon === 5 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon222.png')
                        : require('../images/userIcons/iconG2.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 6)}>
              <Image
                source={this.state.selectedIcon === 6 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon888.png')
                        : require('../images/userIcons/iconG8.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
              />
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.navBar}>

          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 7)}>
              <Image
                source={this.state.selectedIcon === 7 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon333.png')
                        : require('../images/userIcons/iconG3.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.middleContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 8)}>
              <Image
                source={this.state.selectedIcon === 8 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon444.png')
                        : require('../images/userIcons/iconG4.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={this._onPressButton.bind(this, 9)}>
              <Image
                source={this.state.selectedIcon === 9 ||
                        this.state.selectedIcon === false
                        ? require('../images/userIcons/icon555.png')
                        : require('../images/userIcons/iconG5.png')
                      }
                style={{width: 80,
                        height: 80,
                        borderRadius: 80/2,
                        }}
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
  }
});
