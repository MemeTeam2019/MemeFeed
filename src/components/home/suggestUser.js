import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
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
class SuggestUser extends React.PureComponent {
  render() {
    const uid = '3khrPuSqO4XhPKWuz2gSoNFGgdA2'
    if (!uid) return null;
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() => navigation.push('FriendProfile', { uid })}
          style={styles.resultContainer}
        >
          <View>
            <Text style={styles.primaryText}>Siddhi</Text>

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

export default withNavigation(SuggestUser);
