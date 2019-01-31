/*This is an Example of Grid Image Gallery in React Native*/
import * as React from 'react';
//import React in our project
import {
  Image,
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
} from 'react-native';
//import all the needed components
 
import PhotoGrid from 'react-native-image-grid';
 
class HomeFeed extends React.Component {
  constructor() {
    super();
    this.state = {
      imageuri: '',
      ModalVisibleStatus: false,
    };
    this.state = { items: [] };
  }
 
  componentDidMount() {
    var that = this;
    let items = Array.apply(null, Array(60)).map((v, i) => {
      //Using demo placeholder images but you can add your images here
      return { id: i, src: 'https://animals.sandiegozoo.org/sites/default/files/inline-images/orang_male_hand.jpg'};
    });
    that.setState({ items });
  }
  // renderHeader() {
  //   //Header of the Screen
  //   return <Text style={{padding:19, fontSize:20, color:'black', backgroundColor:'white'}}>
  //              Recent
  //          </Text>;
  // }
  ShowModalFunction(visible, imageURL) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  }
 
  renderItem(item, itemSize, itemPaddingHorizontal) {
    //Single item of Grid
    return (
      <TouchableOpacity
        key={item.id}
        style={{
          width: itemSize,
          height: itemSize,
          paddingHorizontal: itemPaddingHorizontal,
        }}
        onPress={() => {
          this.ShowModalFunction(true, item.src);
        }}>
        <Image
          resizeMode="cover"
          style={{ flex: 1 }}
          source={{ uri: item.src }}
        />
      </TouchableOpacity>
    );
  }
 
  render() {
    if (this.state.ModalVisibleStatus) {
      //Modal to show full image with close button 
      return (
        <Modal
          transparent={false}
          animationType={'fade'}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus,'');
          }}>
          <View style={styles.modelStyle}>
            <Image
              style={styles.fullImageStyle}
              source={{ uri: this.state.imageuri }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.closeButtonStyle}
              onPress={() => {
                this.ShowModalFunction(!this.state.ModalVisibleStatus,'');
              }}>
              <Image
                source={{
                  uri:
                    'https://aboutreact.com/wp-content/uploads/2018/09/close.png',
                }}
                style={{ width: 25, height: 25, marginTop:16 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      );
    } else {
      //Photo Grid of images
      return (
        <View style={styles.containerStyle}>
        <PhotoGrid
          data={this.state.items}
          itemsPerRow={3}
          //You can decide the item per row
          itemMargin={1}
          itemPaddingHorizontal={1}
          renderHeader={this.renderHeader}
          renderItem={this.renderItem.bind(this)}
        />
        </View>
      );
    }
  }
}
 
export default HomeFeed;
const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 9,
    position: 'absolute',
  },
});


// import React from 'react';
// import {ScrollView, Text, StyleSheet} from 'react-native';

// export default class HomeFeed extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: this.props.navigation.getParam('name')
//     }
//   }
//   render() {
//     return (
//       <ScrollView>
//         <Text style={styles.title}>
//           Hello, {this.state.name}! :D
//         </Text>
//       </ScrollView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   title: {
//     fontSize: 36,
//     textAlign: 'center',
//     marginTop: '30%'
//   }
// })