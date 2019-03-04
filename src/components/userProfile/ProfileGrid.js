import * as React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
import firebase from 'react-native-firebase';

import Grid from 'react-native-grid-component';

class ProfileGrid extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      memesLoaded: 30,
      imageuri: '',
      ModalVisibleStatus: false,
      isLoading: true,
      memes: [],
      items: []
    }
  }

  componentDidMount() {
    this.setState({uid: firebase.auth().currentUser.uid});
    this.ref = firebase.firestore().collection("Reacts/"+this.state.uid+"/Likes").orderBy('time', "desc");
    this.unsubscribe = this.ref.limit(this.state.memesLoaded).onSnapshot(this.onCollectionUpdate);
    return this.state.memes
  }


  // function for extracting Firebase responses to the state
  onCollectionUpdate = (querySnapshot) => {
    const memes = [];
    querySnapshot.forEach((doc) => {
      const { rank,time,url } = doc.data();
      console.log(rank+url);
      if (rank > 2) {
        memes.push({
         key: doc.id,
         doc, // DocumentSnapshot
         src: url,
         time,
        });
      }
    });
    this.setState({
      memes,
      isLoading: false,
   });
  }


  ShowModalFunction(visible, imageURL) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  }

  _renderItem = (data, i) => (
    <View style={[styles.item]} key={i}>
      <TouchableOpacity
        style={{
          flex: 1,
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
            itemsPerRow={3}
            onEndReached={() => {
              console.log(this.state.memes.length);
              console.log(this.state.memesLoaded);
              if (this.state.memes.length == this.state.memesLoaded){
                newLoadCount = this.state.memesLoaded + 60;
                this.setState({
                  memesLoaded: newLoadCount,
                });
                this.componentDidMount();
            }}}
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
