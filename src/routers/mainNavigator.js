// Main tabbed navigator goes here
import {createBottomTabNavigator} from 'react-navigation';
import {createStackNavigator} from "react-navigation";
import { Icon } from 'react-native-elements';
import React from 'react';

import HomeFeed from '../screens/homefeed';
import ProfileScreen from "../screens/profile";
import FriendFeed from "../screens/friendfeed"
import UserScreen from "../screens/friendprofile";
import Username from "../components/image/username";

export const HomeStack = createStackNavigator({
  Home:{
    screen: HomeFeed,
  },
  User: {
    screen: UserScreen,
  },

},
  {
    initialRouteName: "Home"
  });

export const FriendStack = createStackNavigator({
  Friend:{
    screen: FriendFeed,
  },
  User: {
    screen: UserScreen,
  },

},
  {
    initialRouteName: "Friend"
  });

export const ProfileStack = createStackNavigator({
   Profile:{
    screen: ProfileScreen,
  },
  User: {
    screen: UserScreen,
  },

},
  {
    initialRouteName: "Profile"
})


const MainRouter = createBottomTabNavigator({
  Home: {
    screen: FriendStack,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <Icon name="home" size={35} color={tintColor} />
    }
  },
  Explore:{
    screen: HomeStack,
    navigationOptions: {
      tabBarLabel: 'Explore',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />
    },
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => <Icon name="face" size={35} color={tintColor} />
    },
  },


});

export default MainRouter;
