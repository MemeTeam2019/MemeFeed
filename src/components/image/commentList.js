import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

// import ButtonBar from './buttonBar';
import Comment from './comment';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.renderComment.bind(this);
    console.log(props);
  }

  // Single comment
  renderComment = ({ item }) => {
    return (
      <Comment
        key={item.key}
        username={item.username}
        content={item.content}
        uid={item.uid}
      />
    );
  };

  render() {
    // if there are more comments to load
    if (this.props.commentsLoaded < this.props.commentCount) {
      return (
        <View style={[styles.containerStyle]}>
          {/* <ButtonBar memeId={this.props.memeId} /> */}
          <TouchableOpacity
            onPress={this.props.fetchComments}
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={styles.buttonSty}>Load more comments</Text>
          </TouchableOpacity>
          <FlatList
            data={this.props.comments}
            renderItem={this.renderComment}
          />
        </View>
      );
    }
    // no more comments to load
    return (
      <View style={[styles.containerStyle]}>
        {/* <ButtonBar memeId={this.props.memeId} /> */}
        <FlatList data={this.props.comments} renderItem={this.renderComment} />
      </View>
    );
  }
}

export default CommentList;

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 70,
    bottom: 65,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    marginBottom: 20
  },
  buttonSty: {
    paddingTop: 10,
    fontSize: 15,
    color: 'black',
    fontFamily: 'AvenirNext-Bold',
    textAlign: 'center',
    marginBottom: 20
  },
  loadMore: {
    height: 40,
    width: 205,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
});
