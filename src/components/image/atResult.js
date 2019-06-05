import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import firebase from 'react-native-firebase';

/**
 * Component to display a search result when using the search feature.
 * onPress will navigate to the profile of the user in question.
 *
 * Used by:
 *    atResult.js
 *
 * Props:
 *    data (Object): The data obtained from the DocumentSnapshot of some user,
 *                   e.g. userSnapshot.data(). Refer to the Firebase Users
 *                   collection for the expected object properties.
 */
class AtResult extends React.PureComponent {
  render() {
    const { navigation, data, uid } = this.props;
    if (!data || !uid) return null;
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() => this.props.onSelect(data.username, uid)}
          style={styles.resultContainer}
        >
          <View>
            <Image
              style={styles.profilePic}
              source={{ uri: data.icon || null }}
            />
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

export default AtResult;
