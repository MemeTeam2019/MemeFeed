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
                    <Text style={{fontSize: 15, fontWeight: 'bold', fontStyle: 'italic', color: '#919191'}}> 'r/{this.props.sub}'</Text>
                  </View>
                </View>
                <Text style={styles.textSty4}></Text>
                <View style={styles.rightContainer1}>
                  <View style={styles.rightIcon1} />
                  <TouchableOpacity onPress={this.showActionSheet}>
                    <Text style={styles.report}>. . . </Text>
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
    backgroundColor: 'yellow',
    width: '100%',
    height: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  containerA: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    alignItems: 'center',
    marginTop: 30,
    borderBottomWidth: .5,
    borderColor: '#D6D6D6',
    //borderTopWidth: .5,
    paddingTop: 7
  },
  text: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Bold',
    marginLeft: 10
  },
  userImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 2
  },
  likedFromImg: {
    width: 30,
    height: 25,
  },
  button: {
    flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
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
    backgroundColor: 'red',
  },
  rightContainer1: {
    flex: 1,
    width: '10%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 10
  },
  rightIcon1: {
    height: 10,
    width: '10%',
    resizeMode: 'contain',
    backgroundColor: 'blue',
  },
  report: {
    fontFamily: 'AvenirNext-Bold',
    marginRight: 10,
    fontSize: 20,
    marginBottom: 5,
    color: '#919191'
  }
});
