import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList
} from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';


class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.data.username,
      name: this.props.data.name,
      uid: this.props.uid
    }
  }

  render() {
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("User", {
            uid: this.state.uid
          })}
          style={styles.resultContainer}
        >
          <View>
            <Image
              style={styles.profilePic}
              source={require("../../images/primePic.png")}
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
 * Lists following and followers for uid passed down through props
 */
class FollowList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.navigation.getParam("uid"),
      listToRender: this.props.navigation.getParam("listToRender")
    }
  }

  componentDidMount() {
    const uid = this.props.uid;
    const myRef = firebase.firestore().collection("Users").doc(uid);
    myRef.get().then(snapshot => {

    })
  }

  renderSearchResult = (userRef) => {
    const data = userRef.item.data();
    const uid  = userRef.item.ref.id;
    return <SearchResult data={data} uid={uid}/>;
  }

  render() {
    return (
      <View>
        <FlatList
          data={this.state.results}
          renderItem={(userRef) => this.renderSearchResult(userRef)}
          keyExtractor={(item) => item.ref.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: "5%",
    paddingVertical: "2.5%"
  },
  primaryText: {
    color: "#000",
    fontSize: 24
  },
  secondaryText: {
    color: "#6C757D",
    fontSize: 18
  },
  profilePic: {
    height: 50,
    width: 50,
    marginRight: "5%"
  }
})

const SearchResultNav = withNavigation(SearchResult);
const FollowListNav   = withNavigation(FollowList);

export {
  SearchResultNav as SearchResult,
  FollowListNav as FollowList
}
