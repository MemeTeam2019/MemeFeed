import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

import Username from '../image/username';


/**
 * Component to display a search result when using the search feature.
 * onPress will navigate to the profile of the user in question.
 *
 * Used by:
 *    searchResult.js
 *
 * Props:
 *    data (Object): The data obtained from the DocumentSnapshot of some user,
 *                   e.g. userSnapshot.data(). Refer to the Firebase Users
 *                   collection for the expected object properties.
 */

class SuggestUser extends React.PureComponent {

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.unsubscribe = null;
    this.state = {
      username: '',
      name: '',
      buttonText: '',
      followingLst: [],
      followersLst: [],
      updated: true,
      memes: [],
      oldestDoc: 0,
      selectGridButtonP: true,
      selectListButtonP: false,
      isFollowing: false,
      userExists: false,
      iconURL: ''
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.unsubscribe = firebase
        .firestore()
        .collection('ReactsTest')
        .doc(this.props.navigation.getParam('uid'))
        .collection('Likes')
        .orderBy('time', 'desc')
        .limit(15)
        .get()
        .then(this.updateFeed);

      const myUid = firebase.auth().currentUser.uid;
      const theirUid = this.props.navigation.getParam('uid');
      const myUserRef = firebase
        .firestore()
        .collection('Users')
        .doc(myUid);
      const theirUserRef = firebase
        .firestore()
        .collection('Users')
        .doc(theirUid);

      theirUserRef.get().then((snapshot) => {
        this.setState(snapshot.data());
      });

      //get the profile icon
      firebase
        .firestore()
        .collection('Users')
        .doc(theirUid)
        .get()
        .then((docSnapshot) => {
          if(docSnapshot.exists) {
            const { icon } = docSnapshot.data();
              this.state.iconURL = icon
            //console.log(this.state.iconURL)
          }
          else{
            //console.log("doesn't exist")
          }
        })
        .catch((error) => {
          //console.log(error);
        });

      myUserRef
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data();
            const followingLst = data.followingLst || [];
            const isFollowing = followingLst.indexOf(theirUid) > -1;
            this.setState({
              isFollowing,
              buttonText: isFollowing ? 'Unfollow' : 'Follow',
              userExists: true,
            });
          } else {
            this.setState({ userExists: false });
          }
        })
        .catch((err) => {
          //console.log(err);
        });
    }
  }

  updateFollowing = async (followingState) => {
     const myUid = firebase.auth().currentUser.uid;
     const theirUid = 'g9Nat9KDVMStAHjNOQNfPLVU9Sk1' //emma's uid
     const nowFollowing = !followingState;

     // Get my myFollowingLst
     const followingLst = await myUserRef.get().then((mySnapshot) => {
       return mySnapshot.data().followingLst || [];
     });

     // Get theirFollowersLst
     const followersLst = await theirUserRef.get().then((theirSnapshot) => {
       return theirSnapshot.data().followersLst || [];
     });

     // Add myUid to theirFollowersLst and theirUid to myFollowingLst
     const inFollowingLst = followingLst.indexOf(theirUid) > -1;
     const inFollowersLst = followersLst.indexOf(myUid) > -1;
     if (nowFollowing) {
       if (!inFollowingLst) followingLst.push(theirUid);
       if (!inFollowersLst) followersLst.push(myUid);
     } else {
       if (inFollowingLst)
         followingLst.splice(followingLst.indexOf(theirUid), 1);
       if (inFollowersLst) followersLst.splice(followersLst.indexOf(myUid), 1);
     }

     theirUserRef.update({
       followersLst,
       followersCnt: followersLst.length,
     });
     myUserRef.update({
       followingLst,
       followingCnt: followingLst.length,
     });
     this.setState({
       isFollowing: nowFollowing,
       buttonText: nowFollowing ? 'Unfollow' : 'Follow',
       followersLst,
       followersCnt: followersLst.length,
     });
  }

  render() {
    const followingState = this.state.isFollowing;
    return (
      <View style={styles.navBar1}>
        <View style={styles.leftContainer1}>
          <Text style={[styles.textSty2, { textAlign: 'left' }]}>
            {<Text style={styles.textSty2}>mia</Text>}
            {<Text style={styles.textSty2}>username</Text>}
          </Text>
        </View>

        <View style={styles.rightContainer1}>
          <TouchableOpacity
            onPress={() => this.updateFollowing(followingState)}
          >
            <Text style={styles.followBut}>
              {' '}
              {this.state.buttonText}{' '}
              <Image
                source={require('../../images/follower2.png')}
                style={{ width: 17, height: 17 }}
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      );
  }
};


const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: '5%',
    paddingVertical: '2.5%',
  },
  proPic:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  primaryText: {
    color: '#000',
    fontSize: 24,
  },
  secondaryText: {
    color: '#6C757D',
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: '25%'
  },
  navBar1: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer1: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 3,
    paddingHorizontal: 20,
  },
  rightContainer1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 1,
    marginLeft: '13%',
    paddingRight: 5
  },
  rightIcon1: {
    height: 10,
    width: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
});

export default withNavigation(SuggestUser);
