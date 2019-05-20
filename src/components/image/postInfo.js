import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase';
import { withNavigation } from 'react-navigation';
import moment from 'moment';

import CommentSample from './commentSample';

class PostInfo extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      commentCount: 0,
      commentString: 'view all comments plz chng',
      date: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase
      .firestore()
      .collection(`Comments/${this.props.memeId}/Info`)
      .doc('CommentInfo')
      .get()
      .then(this.onCollectionUpdate); // we choose decsending to get most recent
  }

  // function for extracting Firebase responses to the state
  onCollectionUpdate = () => {
    const countRef = firebase
      .firestore()
      .collection('Comments/' + this.props.memeId + '/Info')
      .doc('CommentInfo');
    countRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const { count } = doc.data();
          this.setState({
            commentString: 'View all ' + count + ' comments',
            commentCount: count,
          });
        }
      })
      .catch((err) => {
        console.log('Error getting document', err);
      });
  };

  handleCommentClick = () => {
    this.props.navigation.navigate('Comment', {
      memeId: this.props.memeId,
      uri: this.props.imageUrl,
      sub: this.props.sub,
      likedFrom: this.props.likedFrom,
      postedBy: this.props.postedBy,
      poster: this.props.poster,
    });
  };

  // Posted time -- converts epoch date to an actual date
  dateConverter = () => {
    const date = new Date(parseInt(this.props.time, 10) * 1000);
    this.setState({ date: moment(date.toString()).fromNow() });
  };

  render() {
    if (this.props.showAllComments) {
      return (
        <View style={styles.postInfo}>
          <Text
            style={{
              fontWeight: 'bold',
              fontFamily: 'AvenirNext-Regular',
              paddingTop: 3,
              marginLeft: '2.5%',
            }}
          >
            {this.props.reactCount} Reactions
          </Text>
          <Text style={styles.time}>{this.state.date}</Text>
        </View>
      );
    } else if (this.state.commentCount > 2) {
      return (
        <View style={styles.postInfo}>
          <Text
            style={{
              fontWeight: 'bold',
              fontFamily: 'AvenirNext-Regular',
              paddingTop: 3,
              marginLeft: '2.5%',
            }}
          >
            {this.props.reactCount} Reactions
          </Text>
          <CommentSample memeId={this.props.memeId} />

          <TouchableOpacity
            onPress={() => {
              this.handleCommentClick();
            }}
          >
            <Text style={styles.commentStringStyle}>
              {this.state.commentString}
            </Text>
          </TouchableOpacity>
          <Text style={styles.time}>{this.state.date}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.postInfo}>
          <Text
            style={{ fontWeight: 'bold', paddingTop: 3, marginLeft: '2.5%' }}
          >
            {this.props.reactCount} Reactions
          </Text>
          <CommentSample memeId={this.props.memeId} />
          <Text style={styles.time}>{this.state.date}</Text>
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
  time: {
    fontSize: 14,
    fontFamily: 'AvenirNext-Regular',
    marginLeft: '2.5%',
    color: '#919191',
  },
});
