import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { withNavigation } from 'react-navigation';


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
          onPress={() => this.props.navigation.navigate("User", {uid: this.state.uid})}
          style={styles.resultContainer}
        >
          <View>
            <Text style={styles.primaryText}>{this.state.username}</Text>
            <Text style={styles.secondaryText}>{this.state.name}</Text>
          </View>
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: "5%"
  },
  primaryText: {
    color: "#000",
    fontSize: 24
  },
  secondaryText: {
    color: "#6C757D",
    fontSize: 24
  },
  profilePic: {
    height: 50
  }
})

export default withNavigation(SearchResult);
