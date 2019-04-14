import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import firebase from 'react-native-firebase';

import ButtonBar from './buttonBar';
import Photo from './photo';
import TileHeader from './tileHeader';
import PostInfo from './postInfo';
import CommentButton from './commentButton'

class Tile extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.updateReactCount = this.updateReactCount.bind(this);
    this.state = {
      reactCount: 0,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const memeid = this.props.memeId;
    const ref = firebase
      .firestore()
      .collection('Memes')
      .doc(memeid);
    ref.get().then(docSnapshot => {
      const data = docSnapshot.data();
      const reactCount = data.reactCount || 0;
      if (this._isMounted) {
        this.setState({ reactCount: reactCount });
      }
    });
  }

  updateReactCount(newReactCount) {
    this.setState({ reactCount: newReactCount });
  }

  render() {
    return (
      <View style={styles.container}>
        <TileHeader
          uid="F5bA3qC0dkca7h1INfoNNq4GIRh2"
          sub={this.props.sub}
          likedFrom={this.props.likedFrom}
          poster={this.props.poster}
        />
        <Photo imageUrl={this.props.imageUrl} />
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View>
            <CommentButton
              imageUrl={this.props.imageUrl}
              memeId={this.props.memeId} 
            />
          </View>
          <View>
            <ButtonBar
              imageUrl={this.props.imageUrl}
              memeId={this.props.memeId}
              imageUrl={this.props.imageUrl}
              postedBy={this.props.postedBy}
              updateReacts={this.updateReactCount}
            />
          </View>
        </View>
        <PostInfo
          memeId={this.props.memeId}
          reactCount={this.state.reactCount}
          imageUrl={this.props.imageUrl}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonbar: {
    flexDirection: 'row',
  }

});

export default Tile;
