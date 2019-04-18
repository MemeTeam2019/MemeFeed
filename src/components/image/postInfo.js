import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';

import CommentSample from './commentSample';
import { withNavigation } from 'react-navigation';

class PostInfo extends React.Component {
  constructor() {
    super();
    this.unsubscribe = null;
    this.state = {
      commentCount: 0,
      commentString: 'view all comments plz chng',
      imageuri: '',
      memeId: '',
      ModalVisibleStatus: false,
      source: 'testing',
    };
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = () => {
    var countRef = firebase
      .firestore()
      .collection('Comments/' + this.props.memeId + '/Info')
      .doc('CommentInfo');
    countRef
      .get()
      .then(doc => {
        if (doc.exists) {
          const { count } = doc.data();
          this.setState({
            commentString: 'View all ' + count + ' comments',
            commentCount: count,
          });
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  };

  componentDidMount() {
    this.unsubscribe = firebase
      .firestore()
      .collection('Comments/' + this.props.memeId + '/Info')
      .doc('CommentInfo')
      .onSnapshot(this.onCollectionUpdate); // we choose decsending to get most recent
  }

  handleCommentClick() {
    this.props.navigation.navigate('Comment', {
      memeId: this.props.memeId,
      uri: this.props.imageUrl,
    });
  }

  render() {
    if (this.state.commentCount > 2) {
      return (
        <View style={styles.postInfo}>
          <Text
            style={{
              fontFamily: 'AvenirNext-Regular',
              paddingTop: 3,
              marginLeft: '2.5%',
            }}
          >
            {this.props.reactCount} Reactions
          </Text>
          {/*}<CommentSample memeId={this.props.memeId} /> */}

          <TouchableOpacity
            onPress={() => {
              this.handleCommentClick();
            }}
          >
            <Text style={styles.commentStringStyle}>
              {this.state.commentString}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.postInfo}>
          {/* <TouchableOpacity
              onPress={() => {
                this.handleCommentClick();
              }}>
              <Image
                style={styles.commentButtonStyle}
                source={require('../../images/Tile/chatLogo2.png')}
              />
            </TouchableOpacity> */}
          <Text
            style={{ fontWeight: 'bold', paddingTop: 3, marginLeft: '2.5%' }}
          >
            {this.props.reactCount} Reactions
          </Text>
            {/* <CommentSample memeId={this.props.memeId} /> */}
        </View>
      );
    }
  }
}

export default withNavigation(PostInfo);

const styles = StyleSheet.create({
  container: {
    fontSize: 16,
    fontFamily: 'AvenirNext-Regular',
    width: '100%',
    height: 100,
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
    top: 20,
    right: 9,
    position: 'absolute',
  },
  commentButtonStyle: {
    height: 32,
    width: 30,
    marginLeft: 15,
    position: 'absolute',
    bottom: 8,
  },
  commentStringStyle: {
    fontFamily: 'AvenirNext-Bold',
    paddingTop: 10,
    marginLeft: '2.5%',
    //color: '#383838'
  },
});
