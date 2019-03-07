
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import ProfileGrid from '../components/userProfile/ProfileGrid';
import Tile from '../components/image/Tile'

import firebase from 'react-native-firebase';


export default class FriendProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('Memes').orderBy('time', "desc");
    this.unsubscribe = null;
    this.state = {
      email: "",
      username: "",
      name: "",
      uid: this.props.navigation.getParam("uid"),
      followingCnt: 0,
      followersCnt: 0,
      open: false,
      selectGridButtonP: true,
      selectListButtonP: false,
      memes: [],
      items: [],
      text: '',
      ModalVisibleStatus: false,
      imageuri: '',
      isFollowing: false,
      buttonText: '',
    }
  }

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  componentDidMount() {
    this.unsubscribe = this.ref.limit(60).onSnapshot(this.onCollectionUpdate);

    const theirUid = this.props.navigation.getParam("uid");
    const docRef = firebase.firestore().collection("Users").doc(theirUid);

    console.log(theirUid);

    docRef.get().then(User => {
      this.setState(User.data());
    })
    .catch(err => {
      console.log(err);
    });


    // Check if their uid is already in my followingLst
    const myUid = firebase.auth().currentUser.uid;
    const myUserRef = firebase.firestore().collection("Users").doc(myUid);

    myUserRef.get().then(snapshot => {
      const data = snapshot.data();
      const followingLst = data.followingLst || [];
      const isFollowing = followingLst.indexOf(theirUid) > -1;

      console.log(followingLst);
      this.setState({
        isFollowing: isFollowing,
        buttonText: isFollowing ? "Unfollow" : "Follow"
      })
    })
    .catch(err => {
      console.log(err);
    })
  }

  onGridViewPressedP = () => {
    this.setState({selectGridButtonP: true})
    this.setState({selectListButtonP: false})
  }

  onListViewPressedP = () => {
    this.setState({selectGridButtonP: false})
    this.setState({selectListButtonP: true})
  }

  followButtonPress = () => {
    const myUid = firebase.auth().currentUser.uid;
    const theirUid = this.props.navigation.getParam("uid");
    const myUserRef = firebase.firestore().collection("Users").doc(myUid);
    const theirUserRef = firebase.firestore().collection("Users").doc(theirUid);

    let isFollowing = !this.state.isFollowing;

    this.setState({
      buttonText: isFollowing ? "Unfollow" : "Follow",
      isFollowing: isFollowing
    });

    // Update my followingLst and followingCnt
    myUserRef.get().then(mySnap => {
      const myData = mySnap.data();
      let followingCnt = myData.followingCnt;
      let followingLst = myData.followingLst || [];

      const index = followingLst.indexOf(theirUid);
      if (isFollowing && index == -1) {
        followingLst.push(theirUid);
        followingCnt++;
      } else if (!isFollowing && index > -1) {
        followingLst.splice(index);
        followingCnt--;
      }

      myUserRef.update({
        followingCnt: followingCnt,
        followingLst: followingLst
      });
    })

    // Update their followersLst and followersCnt
    theirUserRef.get().then(theirSnap => {
      const theirData = theirSnap.data();
      let followersCnt = theirData.followersCnt;
      let followersLst = theirData.followersLst || [];

      const index = followersLst.indexOf(myUid);
      if (isFollowing && index === -1) {
        followersLst.push(myUid);
        followersCnt++;
      } else if (!isFollowing && index > -1) {
        followersLst.splice(index);
        followersCnt--;
      }

      theirUserRef.update({
        followersCnt: followersCnt,
        followersLst: followersLst
      });
      this.setState({followersCnt: followersCnt})
    })
  }

  onCollectionUpdate = (querySnapshot) => {
    const memes = [];
    querySnapshot.forEach((doc) => {
      const { url, time} = doc.data();
      memes.push({
        key: doc.id,
        doc, // DocumentSnapshot
        src: url,
        time,
      });
    });
    this.setState({
      memes,
      isLoading: false,
   });
  }

  ShowModalFunction(visible, imageUrl) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageUrl,
      memeId: memeId,
    });
  }

  renderItem(item, itemSize, itemPaddingHorizontal) {
    //Single item of Grid
    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: itemSize,
          height: itemSize,
          paddingHorizontal: itemPaddingHorizontal,
        }}
        onPress={() => {
          this.ShowModalFunction(true, item.src);
        }}>
        <Image
          resizeMode="cover"
          style={{ flex: 1 }}
          source={{ uri: item.src }}
        />
      </TouchableOpacity>
    );
  }
  renderTile({item}){
    return <Tile
    memeId={item.key}
    imageUrl={item.src}/>
  }

  render() {
    var optionArray = [
      'Logout',
      'Cancel',
    ];
    if (this.state.ModalVisibleStatus) {

      //Modal to show full image with close button
      return (
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus,'');
          }}>
          <View style={styles.modelStyle}>
            {/* Single Image - Tile */}
            <Image
              style={styles.fullImageStyle}
              source={{ uri: this.state.imageuri }}
            />
            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.closeButtonStyle}
              onPress={() => {
                this.ShowModalFunction(!this.state.ModalVisibleStatus,'');
              }}>
              <Image
                source={{
                  uri:
                    'https://aboutreact.com/wp-content/uploads/2018/09/close.png',
                }}
                style={{ width: 25, height: 25, marginTop:16 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      );
    } else if (this.state.selectListButtonP) {
      //Photo List/Full View of images
        return(
          <View style={styles.containerStyle}>
          <View style={styles.navBar}>
                   <Text style={styles.textSty4}>{this.state.username}</Text>
                 </View>
                 {/*Profile Pic, Follwers, Follwing Block*/}
                 <View style={styles.profilePic}>
                 {/*PROFILE PICTURE*/}
                 <Image
                 source={require('../images/primePic.png')} style={{width: 85, height: 85, borderRadius: 85/2}}/>
                 <Text>      </Text>
                 {/*FOLLOWING*/}
                 <Text style={styles.textSty}> {this.state.followingCnt} {"\n"} <Text style={styles.textSty3}>Following</Text></Text>
                 <Text>      </Text>
                 <Text>      </Text>
                 {/*FOLLOWERS*/}
                 <Text style={styles.textSty}>{this.state.followersCnt} {"\n"} <Text style={styles.textSty3}>Followers</Text> </Text>
                 </View>
                 {/*DISPLAY NAME*/}
                 <View style={styles.profilePic}>
                   <Text style={styles.textSty2}>{this.state.name}</Text>
                   <View  style={styles.followBut2}>
                   <TouchableOpacity onPress={() => this.followButton()}>
                    <Text style={styles.followBut}> {this.state.buttonText} <Image source={require('../images/follower2.png')}style={{width: 17, height: 17}} /></Text>

                   </TouchableOpacity>
                   </View>
                 </View>
                 {/*DIFFERENT VIEW TYPE FEED BUTTONS*/}
                 <View style={styles.navBut}>
                 <TouchableOpacity onPress={() => this.onListViewPressedP()}>
                 <Image
                 source={require('../images/fullFeedF.png')} style={{ opacity:  this.state.selectListButtonP
                                                                       ? 1 : 0.3,
                                                                     width: 100, height: 50}}
                 />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={() => this.onGridViewPressedP()}>
                 <Image
                 source={require('../images/gridFeedF.png')} style={{ opacity:  this.state.selectGridButtonP
                                                                       ? 1 : 0.3,
                                                                     width: 100, height: 50}}
                 />
                 </TouchableOpacity>
                 </View>
            <FlatList
              data={this.state.memes}
              renderItem={this.renderTile.bind(this)}
            />
          </View>
        );
    } else {
      //Photo Grid of images
      return (
        <React.Fragment>
        <View style={styles.containerStyle}>
        <View style={styles.navBar}>
       <Text style={styles.textSty4}>{this.state.username}</Text>
     </View>
     {/*Profile Pic, Follwers, Follwing Block*/}
     <View style={styles.profilePic}>
     {/*PROFILE PICTURE*/}
     <Image
     source={require('../images/primePic.png')} style={{width: 85, height: 85, borderRadius: 85/2}}/>
     <Text>      </Text>
     {/*FOLLOWING*/}
     <Text style={styles.textSty}> {this.state.followingCnt} {"\n"} <Text style={styles.textSty3}>Following</Text></Text>
     <Text>      </Text>
     <Text>      </Text>
     {/*FOLLOWERS*/}
     <Text style={styles.textSty}>{this.state.followersCnt} {"\n"} <Text style={styles.textSty3}>Followers</Text> </Text>
     </View>
     {/*DISPLAY NAME*/}
     <View style={styles.profilePic}>
       <Text style={styles.textSty2}>{this.state.name}</Text>
       <Text>      </Text>
       <Text>      </Text>
       <Text>      </Text>
       <Text>      </Text>
       <Text>      </Text>
       <Text>      </Text>
       <View  style={styles.followBut2}>
       <TouchableOpacity onPress={() => this.followButtonPress()}>
        <Text style={styles.followBut}> {this.state.buttonText} <Image source={require('../images/follower2.png')}style={{width: 17, height: 17}} /></Text>

       </TouchableOpacity>
       </View>
     </View>
          {/*
            <View  style={styles.followBut2}>
            <TouchableOpacity onPress={() => this.followButton()}>
             <Text style={styles.followBut}> {this.state.buttonText} <Image source={require('../images/follower2.png')}style={{width: 17, height: 17}} /></Text>
            </TouchableOpacity>
            </View>
            */}

     {/*DIFFERENT VIEW TYPE FEED BUTTONS*/}
     <View style={styles.navBut}>
     <TouchableOpacity onPress={() => this.onListViewPressedP()}>
     <Image
     source={require('../images/fullFeedF.png')} style={{ opacity:  this.state.selectListButtonP
                                                           ? 1 : 0.3,
                                                         width: 100, height: 50}}
     />
     </TouchableOpacity>
     <TouchableOpacity onPress={() => this.onGridViewPressedP()}>
     <Image
     source={require('../images/gridFeedF.png')} style={{ opacity:  this.state.selectGridButtonP
                                                           ? 1 : 0.3,
                                                         width: 100, height: 50}}
     />
     </TouchableOpacity>
     </View>
     </View>
     <ProfileGrid/>
     </React.Fragment>
      );
    }
  }
}
//import friend grid and pass the uid as a prop instead of the <ProfileGrid/> component ^^^
const styles = StyleSheet.create({
  containerStyle: {
    flex: 0,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#ffffff"
  },
  headerSty: {
    height: 0,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50,//50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
  },
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812',
  },
  navBar: {
    height:95,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 50,//50
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white'
  },
  navBut: {
    height:50,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSty: {
    fontSize: 17,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
  },
  textSty2: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
  },
  textSty3: {
    fontSize: 15,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    //fontWeight: 'bold',
    //color: '#778899',
  },
  textSty4: {
    fontSize: 20,
    fontFamily: 'HelveticaNeue-Bold',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  textSty5: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingRight: 2,
    paddingLeft: 2,
    paddingHorizontal: 10,
    borderColor: '#778899',
    color: '#778899',
    borderWidth: 1,
    borderRadius: 5,
  },
  profilePic: {
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    paddingTop: 10,//50
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 360,
    fontFamily: 'AvenirNext-Regular',
    textAlign: 'center',
    backgroundColor: 'white'
  },
  textshadow:{
    fontSize:40,
    color:'#FFFFFF',
    fontFamily:'Times New Roman',
    paddingLeft:30,
    paddingRight:30,
    textShadowColor:'#585858',
    textShadowOffset:{width: 5, height: 5},
    textShadowRadius:20,
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
    backgroundColor: 'white'
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'rgba(255,255,255,1)',
    backgroundColor: 'white'
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    backgroundColor: 'white',
    right: 9,
    position: 'absolute',
  },
  followBut: {
    fontSize: 17,
    fontFamily: 'AvenirNext-Regular',
    borderColor: '#A4A4A4',
    //color: '#5B5B5B',
    justifyContent: 'center'
  },
  followBut2: {
    //borderWidth: 0.6,
    width: '30%',
    //borderRadius: 3.5,
    marginLeft: 10, //20
    flexDirection: 'row',
    justifyContent: 'center',
    //marginTop: 10,
  }
})
