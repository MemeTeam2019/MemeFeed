import React from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native'
import { withNavigation } from 'react-navigation'
import { SearchBar } from 'react-native-elements'

/**
 * Component to display a search result when using the search feature.
 * onPress will navigate to the profile of the user in question, passing down
 * the appropriate props
 *
 * Props - username: string, name: string, uid: string
 */
class SearchResult extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.data.username,
      name: this.props.data.name,
      uid: this.props.uid,
    }
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
    )
  }
}

/**
 * Generates a FlatList of SearchResults to display in search results or
 * when the user is viewing someone's following or follower list.
 *
 * Props - listToRender: Array[String]
 *
 */
class FollowList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { title: navigation.getParam('title', '') }
  }

  constructor(props) {
    super(props)
    this.allResults = this.props.navigation.getParam('allResults', [])
    this.title = this.props.navigation.getParam('title', '')

    console.log(this.allResults)
    this.state = {
      filteredResults: [],
      searchTerm: '',
    }
  }

  renderResult = userRef => {
    const data = userRef.item.data()
    const uid = userRef.item.ref.id
    return <SearchResult data={data} uid={uid} />
  }

  updateFilteredResults = (searchTerm = '') => {
    let filtered = this.allResults
    if (searchTerm) {
      filtered = this.allResults.filter(doc => {
        const { username, name } = doc.data()
        return (
          username.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
          name.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
      })
    }
    return filtered
  }

  render() {
    return (
      <View>
        <SearchBar />
        <FlatList
          data={this.allResults}
          renderItem={userRef => this.renderResult(userRef)}
          keyExtractor={item => item.ref.id}
        />
      </View>
    )
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
})

// Both components depend on navigation props to route to ProfileScreen
const FollowListNav = withNavigation(FollowList)
const SearchResultNav = withNavigation(SearchResult)

export { SearchResultNav as SearchResult, FollowListNav as FollowList }
