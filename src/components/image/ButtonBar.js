import React, { Component } from 'react';
import { Alert, AppRegistry, Button, StyleSheet, View } from 'react-native';
 
import Grid from 'react-native-grid-component';
 
class ButtonBar extends React.Component {
  _renderItem = (data, i) => (
    <View  
      style={[{ backgroundColor: 'rgba(255,255,255,1)' }, styles.item]} 
      key={i} 
    >
    <Button
            onPress={this._onPressButton}
            title="Press Me"
          />
    </View>
  );
 
  _renderPlaceholder = i => <View style={styles.item} key={i} />;
 
  render() {
    return (
      <Grid
        style={styles.list}
        renderItem={this._renderItem}
        renderPlaceholder={this._renderPlaceholder}
        data={['black', 'white', 'red', 'green', 'blue']}
        itemsPerRow={5}
      />
    );
  }
}


export default ButtonBar; 
 
const styles = StyleSheet.create({
  item: {
    flex: 1,
    height: 190,
    margin: 1
  },
  list: {
    flex: 1
  }
});
