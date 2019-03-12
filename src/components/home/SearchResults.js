import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

/**
 * Component to display a search result when using the search feature.
 * onPress will navigate to the profile of the user in question, passing down
 * the appropriate props
 *
 * Props - username: String, name: String, uid: String
 */
class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.data.username,
      name: this.props.data.name,
      uid: this.props.uid,
    };
  }

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('User', {
              uid: this.state.uid,
            })
          }
          style={styles.resultContainer}
        >
          <View>
            <Image
              style={styles.profilePic}
              source={require('../../images/primePic.png')}
            />
          </View>
          <View>
            <Text style={styles.primaryText}>{this.state.username}</Text>
            <Text style={styles.secondaryText}>{this.state.name}</Text>
          </View>
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

/**
 * Generates a FlatList of SearchResults to display in search results or
 * when the user is viewing someone's following or follower list.
 *
 * Props - navigation.arrayOfUids: Array[String], navigation.title: String
 */
class FollowList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { title: navigation.getParam('title', '') };
  };

  constructor(props) {
    super(props);
    this.arrayOfUids = this.props.navigation.getParam('arrayOfUids', []);
    this.title = this.props.navigation.getParam('title', '');

    this.state = {
      usersToRender: [],
      searchTerm: '',
    };
  }

  componentDidMount() {
    let usersToRender = [];
    let arrayOfUids = this.props.navigation.getParam('arrayOfUids', []);
    usersToRender = arrayOfUids.map(async uid => {
      return await firebase
        .firestore()
        .collection('Users')
        .doc(uid)
        .get()
        .then(snapshot => {
          return snapshot;
        });
    });
    Promise.all(usersToRender).then(fulfilled => {
      this.setState({ usersToRender: fulfilled });
    });
  }

  renderResult = (snapshot = null) => {
    if (snapshot) {
      const data = snapshot.item.data();
      const uid = snapshot.item.ref.id;
      return <SearchResultNav data={data} uid={uid} />;
    }
  };

  updateFilteredResults = (searchTerm = '') => {
    let filtered = this.allResults;
    if (searchTerm) {
      filtered = this.allResults.filter(doc => {
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
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={this.state.usersToRender}
          renderItem={user => this.renderResult(user)}
          keyExtractor={user => user.ref.id || -1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: '5%',
    paddingVertical: '2.5%',
  },
  primaryText: {
    color: '#000',
    fontSize: 24,
  },
  secondaryText: {
    color: '#6C757D',
    fontSize: 18,
  },
  profilePic: {
    height: 50,
    width: 50,
    marginRight: '5%',
  },
});

// Both components depend on navigation props to route to ProfileScreen
const FollowListNav = withNavigation(FollowList);
const SearchResultNav = withNavigation(SearchResult);

export { SearchResultNav as SearchResult, FollowListNav as FollowList };
