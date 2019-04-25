/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';

class PrivacyPolicyScreen extends React.PureComponent {
  static navigationOptions = {
    header: null,
  };

  render() {
    const signup = this.props.navigation.getParam('signup', false);
    return (
      <View>
        <ScrollView style={{ marginBottom: 40 }}>
          <Text style={styles.header}>Meme Feed Privacy Policy</Text>
          <Text style={styles.body}>
            Effective date: April 22, 2019 {'\n\n'}
            Thanks for entrusting Meme Feed with your name, email, password, and
            meme tastes. We make keep your private information secure as it is
            of the utmost priority for us. {'\n\n'}
            We only collect two types of information from you: {'\n\n'}
            1. Sign up information: name, username, email, & password {'\n'}
            2. Reaction information: your rankings of memes {'\n\n'}
            For the signup information we keep your email and password private
            and encrypted, but your name and username are kept public on your
            profile. While your username and name are public they are only
            available to others that are logged in with a Meme Feed account. We
            only use your name, username, email, & password as a way to both
            authenticate and identify your account, we don't sell it to third
            parties; and we only use it as this Privacy Policy describes.{' '}
            {'\n\n'}
            As for your reactions to Memes, reactions rated as 3 or higher are
            made public through our reaction system, while reactions rated as 1
            and 2 are not public. When you react to a meme with a 3, 4, or 5
            that meme will appear on your profile and on your follower’s home
            feed. We collect all of this data with your knowing consent. We
            collect the signup information when you sign up and we collect the
            reaction information when you react to a meme. By giving us your
            consent you are allowed to use this application and we are allowed
            to use your information as outlined in this Privacy Statement.{' '}
            {'\n\n'}
            If you wish you delete your account information and data you can
            contact us at:{' '}
            <Text style={styles.email}>memefeedaye@gmail.com</Text>
          </Text>
          <Button
            title='Back'
            color='#9F02FF'
            style={{ paddingTop: 30, marginBottom: '30' }}
            onPress={() => this.props.navigation.pop()}
          />
        </ScrollView>
      </View>
    );
  }
}

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    paddingTop: '15%',
  },
  body: {
    fontSize: 14,
    fontFamily: 'AvenirNext-Regular',
    paddingVertical: '7.5%',
    paddingHorizontal: '6%',
  },
  email: {
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '5%',
  },
  nextBut: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '5%',
  },
});
