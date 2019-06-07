import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

import ButtonBar from './buttonBar';
import Photo from './photo';
import TileHeader from './tileHeader';
import PostInfo from './postInfo';
import CommentButton from './commentButton';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.unsubscribe = false;
    this.updateReactCount = this.updateReactCount.bind(this);
    this.state = {
      reactCount: this.props.reacts,
    };
  }

  componentDidMount() {
    const memeid = this.props.memeId;
    const ref = firebase
      .firestore()
      .collection('Memes')
      .doc(memeid);
    ref.get().then((docSnapshot) => {
      const data = docSnapshot.data();
      const reactCount = data.reactCount || 0;
      this.setState({ reactCount });
    });
  }

  componentWillUnmount() {
    this.unsubscribe = null;
  }

  updateReactCount(newReactCount) {
    this.setState({ reactCount: newReactCount });
  }

  render() {
    return (
      <View style={styles.container}>
        <TileHeader
          sub={this.props.sub}
          likedFrom={this.props.likedFrom}
          poster={this.props.poster}
          memeId={this.props.memeId}
          isSubRedditPg={this.props.isSubRedditPg}
        />
        <Photo imageUrl={this.props.imageUrl} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            borderColor: '#D6D6D6',
            borderTopWidth: 0.5,
          }}
        >
          <View>
            <CommentButton
              imageUrl={this.props.imageUrl}
              memeId={this.props.memeId}
              sub={this.props.sub}
              likedFrom={this.props.likedFrom}
              postedBy={this.props.postedBy}
              poster={this.props.poster}
              caption={this.props.caption}
              time={this.props.time}
            />
          </View>
          <View>
            <ButtonBar
              imageUrl={this.props.imageUrl}
              memeId={this.props.memeId}
              postedBy={this.props.postedBy}
              updateReacts={this.updateReactCount}
              caption={this.props.caption}
              reacts={this.props.reacts}
            />
          </View>
        </View>
        <PostInfo
          memeId={this.props.memeId}
          reactCount={this.state.reactCount}
          imageUrl={this.props.imageUrl}
          sub={this.props.sub}
          likedFrom={this.props.likedFrom}
          postedBy={this.props.postedBy}
          poster={this.props.poster}
          showAllComments={this.props.showAllComments}
          caption={this.props.caption}
          time={this.props.time}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 5,
  },
  buttonbar: {
    flexDirection: 'row',
  },
});

export default withNavigation(Tile);
