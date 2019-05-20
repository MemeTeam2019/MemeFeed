import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import ActionSheet from 'react-native-actionsheet';
import firebase from 'react-native-firebase';

class SourceReddit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    }
  }

  goToSubreddit() {
    console.log(this.props.isSubRedditPg);
    if (!this.props.isSubRedditPg) {
      this.props.navigation.push('SubReddit', {
        sub: this.props.sub
      });
    }
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  flagMeme = () => {
    const memeRef = firebase.firestore().doc(`Memes/${this.props.memeId}`);
    memeRef
      .get()
      .then((docSnapshot) => {
        const { numFlags } = docSnapshot.data();
        memeRef.update({ numFlags: numFlags + 1 });
      })
      .catch((err) => {
        Alert.alert(
          'Oops!',
          'Something went wrong when flagging this image. Please contact us at memefeedaye@gmail.com',
          { text: 'Ok' }
        );
        console.log(err);
      });
  };

  render() {
    const optionArray = ['Inappropriate/Irrelevant', 'Cancel'];
    // if just from reddit (a.k.a. on the explore page)
    return (
      <View style={styles.navBar1}>
        <View style={styles.leftContainer1}>
          <View style={styles.container}>
            <Text style={{ fontSize: 15 }}>sourced from </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                fontStyle: 'italic',
                color: '#919191',
                width: 900,
                marginRight: 2,
              }}
            >
              {' '}
              'r/{this.props.sub}'
            </Text>
          </View>
        </View>
        <View style={styles.rightContainer1}>
          <View style={styles.rightIcon1} />
          <TouchableOpacity onPress={this.showActionSheet}>
            <Text style={styles.report}>...</Text>
          </TouchableOpacity>
          <ActionSheet
            ref={(o) => {
              this.ActionSheet = o;
            }}
            options={optionArray}
            cancelButtonIndex={1}
            destructiveIndex={0}
            onPress={(index) => {
              if (optionArray[index] === 'Inappropriate/Irrelevant') {
                this.flagMeme();
              }
            }}
          />
        </View>
      </View>
    );
  }
}
const hitSlop = { top: 15, bottom: 15, left: 15, right: 15 };

export default withNavigation(SourceReddit);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    height: 30,
    paddingHorizontal: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  navBar1: {
    height: 95,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  leftContainer1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  rightContainer1: {
    flex: 1,
    width: '1%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 10,
  },
  rightIcon1: {
    height: 10,
    width: '0%',
    backgroundColor: 'transparent',
  },
  report: {
    fontFamily: 'AvenirNext-Bold',
    marginRight: 5,
    fontSize: 20,
    marginBottom: 5,
    color: '#919191',
    backgroundColor: 'white'
  },
  touchSpace: {
    padding: 5,
    fontSize: 15,
    fontFamily: 'AvenirNext-Bold',
    fontStyle: 'italic',
    color: '#919191',
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
    width: 900,
    marginRight: 2,
    paddingLeft: 5
  }
});
