import * as React from 'react';
import firebase from 'react-native-firebase';

//import React in our project
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
} from 'react-native';


import Grid from 'react-native-grid-component';
// const uid = firebase.auth().currentUser.uid;
class ProfileGrid extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection("Memes");
    this.unsubscribe = null;
    this.state = {
      imageuri: '',
      ModalVisibleStatus: false,
      isLoading: true,
      memes: [],
      items: [],
    };
  }


  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    console.log("screams");
    const memes = [];
    querySnapshot.forEach((doc) => {
      const { url, time} = doc.data();
      console.log(url, time);
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
    // querySnapshot.forEach((doc) => {
    //   const {memeid,rating,time} = doc.data();
    //   //const {url,time}=doc.data();
    //   if(rating>2){
    //     var url;
    //     var dref = firebase.firestore().collection('Memes').doc(memeid)
    //       dref.get().then(function(doc) {
    //         if (doc.exists) {
    //         url = doc.data().url;
    //         memes.push({
    //       key: doc.id,
    //       doc, // DocumentSnapshot
    //       src: url,
    //       time,
    //     });
    //     }
    //   });
      
    //  }
    
    // });
  //   this.setState({
  //     memes,
  //     isLoading: false,
  //  });
  }


  ShowModalFunction(visible, imageURL) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  }

  componentDidMount() {
    this.unsubscribe = this.ref.limit(60).onSnapshot(this.onCollectionUpdate);
  }


        // <Image
        //   style={{ flex: 1 }}
        //   source={{
        //     uri:
        //       data.src,
        //   }}
        // />

  _renderItem = (data, i) => (

    <View style={[styles.item]} key={i}>


      <TouchableOpacity
        style={{
          flex: 1,
          // width: itemSize,
          // height: itemSize,
          // paddingHorizontal: itemPaddingHorizontal,
        }}
        onPress={() => {
          this.ShowModalFunction(true, data.src);
        }}>
        <Image
          style={{ flex: 1 }}
          source={{
            uri:
              data.src,
          }}
        />
      </TouchableOpacity>


    </View>
  );
 
  _renderPlaceholder = i => <View style={styles.item} key={i} />;
 
  render() {

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
            <Image
              style={styles.fullImageStyle}
              source={{ uri: this.state.imageuri }}
            />
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
    } else {
         return (

      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={this.state.memes}
        // data={['black', 'white', 'red', 'green', 'blue','black', 'white', 'red', 'green', 'blue','black', 'white', 'red', 'green', 'blue']}
        itemsPerRow={3}
      />
      );
    }
    
  }
}

export default ProfileGrid; 
 
const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 160,
    margin: 1,
    aspectRatio: 1
  },
  list: {
    flex: 1
  },
  containerStyle: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    marginTop: 20,
    flex: 1
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 9,
    position: 'absolute',
  },
});