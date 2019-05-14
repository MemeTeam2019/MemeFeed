import * as React from 'react';
import {
  View,
  StyleSheet,
	Alert,
	Dimensions,
	KeyboardAvoidingView,
	Button,
	ScrollView
} from 'react-native';

import firebase from 'react-native-firebase';
import { TextInput } from 'react-native-gesture-handler';
import AutoHeightImage from 'react-native-auto-height-image';

class CaptionPage extends React.Component{
	static navigationOptions = {
		title: 'Upload',
		headerTitleStyle: {
			fontSize: 20,
			fontFamily: 'Avenir Next',
			fontWeight: 'normal'
		},
		headerRight: (
			<Button
				onPress={this.handleUpload}
				title="Post  "
			/>
		)
	};

  constructor(props) {
    super(props);
    this.state = {
      filename: this.props.navigation.getParam('filename', ''),
			imageuri: this.props.navigation.getParam('imageuri', ''),
      caption: '',
    };
	}

	handleUpload = () => {
		if (!this.state.imageuri) {
			Alert.alert('Upload Failed', 'Please try again :(');
			return;
		}
    const storRef = firebase.storage().ref('meme_images').child(firebase.auth().currentUser.uid+this.state.filename);
    storRef.putFile(this.state.imageuri).catch(() => Alert.alert('Upload Failed', 'Please try again :('));
    storRef.getDownloadURL().then((newurl) => {
			const reactRef = firebase.firestore().collection('MemesTest');
			var data = {
				filename: this.state.filename,
				url: newurl,
				author: firebase.auth().currentUser.uid,
				sub: 'MemeFeed',
				time: Math.round(+new Date() / 1000),
				score: 0,
				caption: this.state.caption,
				reacts: 0,
				numFlags: 0
			};
			reactRef.add(data).catch(() => Alert.alert('Upload Failed', 'Please try again :('));
			const proRef = firebase.firestore().collection('ReactsTest').doc(firebase.auth().currentUser.uid).collection('Likes');
				var data2 = {
					rank: 4,
					time: Math.round(+new Date() / 1000),
					url: newurl,
					likeFrom: 'MemeFeed',
				};
				proRef.add(data2).catch(() => Alert.alert('Upload Failed', 'Please try again :('));
			});
	}

	render() {
		return(
			<KeyboardAvoidingView
			  behavior="position"
				keyboardVerticalOffset={Dimensions.get('window').height * 0.12 }>
				<View>
					<ScrollView
					ref={(ref) => {
						this.scrollView = ref;
					}}
					>
					  <View style={styles.conatiner}>
						  <AutoHeightImage
								style={styles.image}
								source={{uri: this.state.imageuri}}
								width={Dimensions.get("window").width}
						  />
							<TextInput
								style = {styles.input}
								placeholder="Enter a Caption"
								onChangeText = {(caption) => this.setState({caption: caption})}
								autoCapitalize="none"
								multiline
							/>
						</View>
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

export default CaptionPage;

const styles = StyleSheet.create({
	conatiner: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	navBar: {
    height: '15%',
    paddingTop: '5%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: '#D6D6D6'
	},
	input: {
		width: Dimensions.get('screen').width * 0.95,
		height: 60,
		borderRadius: 10,
		fontSize: 18,
		marginVertical: 8,
		padding: 8,
		backgroundColor: '#efefef',
		marginHorizontal: '2.5%',
		marginTop: '10%'
	},
	postButton: {
		fontFamily: 'AvenirNext-Regular',
		fontSize: 20,
		marginTop: '8%'
	},
	textSty4: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    backgroundColor: 'white',
    paddingRight: 3,
    paddingHorizontal: 10,
	},
	image: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '10%',
	}
});
