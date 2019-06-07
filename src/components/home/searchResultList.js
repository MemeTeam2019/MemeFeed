import React from 'react';
import { FlatList } from 'react-native';
import firebase from 'react-native-firebase';

import SearchResult from './searchResult';

/**
 * Generates a FlatList of SearchResults to display in search results or
 * when the user is viewing someone's following or follower list.
 *
 *
 * Used by:
 *     mainNavigator.js
 * Props:
 *     navigation.title (String): Title to be rendered in header. Will be
 *         'Following' or 'Followers'
 *     navigation.arrayOfUids (Array[String]): Array of uids to be rendered in
 *         the FlatList. Need to query Firebase for each user's data, handled
 *         in componentDidMount()
 */
class FollowList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { title: navigation.getParam('title', '') };
  };

  constructor(props) {
    super(props);
    this.state = {
      usersToRender: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    let usersToRender = [];
    const arrayOfUids = navigation.getParam('arrayOfUids', []);
    usersToRender = arrayOfUids.map((uid) =>
      firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then((snapshot) => snapshot)
    );
    Promise.all(usersToRender).then((fulfilled) => {
      this.setState({ usersToRender: fulfilled });
    });
  }

  renderResult = (snapshot = null) => {
    if (snapshot) {
      const data = snapshot.item.data();
      const uid = snapshot.item.ref.id;
      return <SearchResult data={data} uid={uid} />;
    }
    return null;
  };

  updateFilteredResults = (searchTerm = '') => {
    let filtered = this.allResults;
    if (searchTerm) {
      filtered = this.allResults.filter((doc) => {
        const { username, name } = doc.data();
        return (
          username.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );
      });
    }
    return filtered;
  };

  render() {
    const { usersToRender } = this.state;
    return (
      <React.Fragment style={{ flex: 1 }}>
        <FlatList
          data={usersToRender}
          renderItem={(user) => this.renderResult(user)}
          keyExtractor={(user) => user.ref.id || -1}
        />
      </React.Fragment>
    );
  }
}

export default FollowList;
