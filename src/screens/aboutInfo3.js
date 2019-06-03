import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  Text,
  Button,
} from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <ScrollView>
          <ImageBackground
            source={require('../images/white.png')}
            style={styles.background}
          >
            <View style={styles.container}>
              <Text style={styles.title}>Coming Soon</Text>
            </View>
            <View style={styles.aboutText}>
              <Text style={styles.aboutText}>
                MemeFeed is current a Beta verison!
              </Text>
              <Text style={styles.aboutText}>
                Be sure to update the app later this year for new features
                including Meme Uploading, User Tagging, and an all new Meme
                Recommendation Algorithm for meme suggestions personalized to
                your meme taste.
              </Text>
              <Text style={styles.aboutText2}>
                Contact us at memefeedaye@gmail.com
              </Text>
            </View>
            <View style={styles.nextBut}>
              <Button
                title='Done'
                color='#000'
                onPress={() => this.props.navigation.push('Profile')}
              />
            </View>
          </ImageBackground>
        </ScrollView>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    //backgroundColor: 'blue',
    marginTop: '25%',
    //marginBottom: '2%'
  },
  title: {
    fontSize: 35,
    fontFamily: 'AvenirNext-Regular',
    color: '#000',
    paddingHorizontal: '5%',
    marginBottom: '0.5%',
    textAlign: 'center',
    height: 50,
    //backgroundColor: 'red',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0.4,
  },
  aboutText: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    color: '#000',
    paddingHorizontal: '4%',
    marginBottom: '1%',
    paddingRight: 5,
    paddingTop: 1,
    paddingLeft: 5,
    marginLeft: '3%',
    marginRight: '3%',
  },
  aboutText2: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    color: '#000',
    paddingHorizontal: '4%',
    marginBottom: '1%',
    paddingRight: 5,
    paddingTop: 20, //50
    paddingLeft: 5,
    //backgroundColor: 'blue',
    marginLeft: '3%',
    marginRight: '3%',
    //height: '50%'
    justifyContent: 'center',
    textAlign: 'center',
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
  },
  aboutText2: {
    fontSize: 18,
    fontFamily: 'AvenirNext-Regular',
    color: '#000',
    paddingHorizontal: '4%',
    marginBottom: '1%',
    paddingRight: 5,
    paddingTop: 20,
    paddingLeft: 5,
    marginLeft: '3%',
    marginRight: '3%',
    justifyContent: 'center',
    textAlign: 'center',
  },
});
