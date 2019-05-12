import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import Notification from './noteContainer';

/**
 * Render a list of memes using the Tile component
 *
 * Props
 * -----
 * notes: Array[Object]
 * loadNotes: function
 */
class NoteList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageuri: '',
      isLoading: true,
      notes: [],
    };
  }

  renderNote = ({ item }) => {
    if (!item || !item.type) return null;
    return (
      <Notification
        type={item.type}
        uid={item.uid}
        memeid={item.memeid}
      />
    );
  };

  render() {
    return (
      <FlatList
        style={styles.containerStyle}
        data={this.props.notes}
        renderItem={this.renderNote.bind(this)}
        onEndReached={() => {
          // only load memes if previous ones finished loading
          this.props.loadNotes();
        }}
      />
    );
  }
}

export default NoteList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
