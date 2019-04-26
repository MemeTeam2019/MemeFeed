import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';

const primePic = require('../../images/primePic.png');
import firebase from 'react-native-firebase';

/**
 * Component to display a search result when using the search feature.
 * onPress will navigate to the profile of the user in question.
 *
 * Used by:
 *    searchResult.js
 *
 * Props:
 *    data (Object): The data obtained from the DocumentSnapshot of some user,
 *                   e.g. userSnapshot.data(). Refer to the Firebase Users
 *                   collection for the expected object properties.
 */
class SearchResult extends React.PureComponent {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.unsubscribe = null;
    this.state = {
      iconURL: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      //get the profile icon
      firebase
        .firestore()
        .collection('Users')
        .doc(this.props.uid)
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            const { icon } = docSnapshot.data();
            this.state.iconURL = icon;
            console.log(this.state.iconURL);
            console.log(icon);
          } else {
            console.log("doesn't exist");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    const { navigation, data, uid } = this.props;
    if (!data || !uid) return null;
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() => navigation.push('FriendProfile', { uid })}
          style={styles.resultContainer}
        >
          <View>
            <Image style={styles.profilePic} source={{ uri: data.icon }} />
          </View>
          <View>
            <Text style={styles.primaryText}>{data.username}</Text>
            <Text style={styles.secondaryText}>{data.name}</Text>
          </View>
        </TouchableOpacity>
      </React.Fragment>
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
    borderRadius: 50 / 2,
  },
});

export default withNavigation(SearchResult);
