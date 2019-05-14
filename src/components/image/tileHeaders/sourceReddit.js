import React, { Component } from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { withNavigation } from 'react-navigation';
import Username from '../username';
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
    console.log(this.props.sub)
    this.props.navigation.push('SubReddit', {
      sub: this.props.sub
    });
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  render() {
        var optionArray = ['Inappropriate/Irrelevant', 'Cancel'];
    // if just from reddit (a.k.a. on the explore page)
    return (
              <View style={styles.navBar1}>
                <View style={styles.leftContainer1}>
                <View style={styles.container}>
                    <Text style={{fontSize: 15}}>sourced from </Text>
                    <TouchableOpacity onPress={() => this.goToSubreddit()}>
                      <Text style={{fontSize: 15, fontWeight: 'bold', fontStyle: 'italic', color: '#919191', width: 900, marginRight: 2}}> 'r/{this.props.sub}'</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.rightContainer1}>
                  <View style={styles.rightIcon1} />
                    <TouchableOpacity onPress={this.showActionSheet}>
                      <Text style={styles.report}> . . . </Text>
                    </TouchableOpacity>
                    <ActionSheet
                      ref={(o) => (this.ActionSheet = o)}
                      options={optionArray}
                      cancelButtonIndex={1}
                      destructiveIndex={0}
                      onPress={(index) => {
                        if (optionArray[index] == 'Inappropriate/Irrelevant') {

                        }
                      }}
                    />
                </View>
              </View>
    );
  }
}

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
    paddingTop: 50, //50
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
    marginRight: 10
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
  }
});
