import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

import NoteList from '../components/notifications/noteList';

/**
 * A list of Notifications from other users
 *
 * Used by:
 *     mainNavigator.js
 *
 * Props:
 *     None
 */
class NotePage extends React.Component {
  static navigationOptions = {
    title: 'Notifications',
  };

  constructor(props) {
    super(props);
    this.refreshNotes = this.refreshNotes.bind(this);
    this.notificationListener = null;
    this.state = {
      notes: [],
      refreshing: true,
    };
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('Notifications')
      .doc(firebase.auth().currentUser.uid)
      .collection('Notes')
      .orderBy('time', 'desc')
      .limit(15)
      .get()
      .then(this.updateList);
  }
//get new notes
  refreshNotes = () => {
    this.setState({ refreshing: true, notes: [], oldestDoc: null }, () => {
      firebase
        .firestore()
        .collection('Notifications')
        .doc(firebase.auth().currentUser.uid)
        .collection('Notes')
        .orderBy('time', 'desc')
        .limit(15)
        .get()
        .then(this.updateList);
    });
  };

  fetchNotes = () => {
    // garentees not uploading duplicate memes by checking if memes have finished
    // updating
    const oldestDoc = this.state.oldestDoc;
    firebase
      .firestore()
      .collection('Notifications')
      .doc(firebase.auth().currentUser.uid)
      .collection('Notes')
      .orderBy('time', 'desc')
      .limit(15)
      .startAfter(oldestDoc)
      .get()
      .then(this.updateList);
  };

  updateList = (querySnapshot) => {
    const newNotes = [];
    querySnapshot.docs.forEach((doc) => {
      const { type, time, uid, memeId, viewed } = doc.data();
      newNotes.push({
        notificationId: doc.id,
        type,
        doc,
        uid,
        time,
        memeId,
        viewed,
      });
    });

    Promise.all(newNotes).then((resolvedNotes) => {
      this.setState((prevState) => {
        const mergedNotes = prevState.notes.concat(resolvedNotes);
        return {
          notes: mergedNotes,
          oldestDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
          refreshing: false,
        };
      });
    });
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        {/* List View */}
        <NoteList
          loadNotes={this.fetchNotes}
          notes={this.state.notes}
          refreshing={this.state.refreshing}
          refreshNotes={this.refreshNotes}
        />
      </View>
    );
  }
}

export default NotePage;

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
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
  navBar: {
    height: 95,
    elevation: 3,
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  navBut: {
    height: 50,
    backgroundColor: 'white',
    elevation: 3,
    paddingHorizontal: 20,
    paddingRight: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#D6D6D6',
  },
});
