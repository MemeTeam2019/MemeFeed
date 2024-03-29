import React from 'react';
import { StyleSheet, FlatList, RefreshControl } from 'react-native';

import Notification from './noteContainer';

/**
 * Render a list of memes using the noteContainer component
 *
 * Props
 * -----
 * notes: Array[Object]
 * loadNotes: function
 */
class NoteList extends React.Component {
  constructor(props) {
    super(props);
    this.renderNote = this.renderNote.bind(this);
  }

  renderNote = ({ item }) => {
    if (!item || !item.type) return null;
    return (
      <Notification
        notificationId={item.notificationId}
        type={item.type}
        uid={item.uid}
        memeId={item.memeId}
        viewed={item.viewed}
        time={item.time}
      />
    );
  };

  render() {
    return (
      <FlatList
        style={styles.containerStyle}
        data={this.props.notes}
        renderItem={this.renderNote}
        keyExtractor={(item) => item.notificationId}
        onEndReached={() => {
          this.props.loadNotes();
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.refreshNotes}
          />
        }
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
