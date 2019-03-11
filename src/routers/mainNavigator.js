// Main tabbed navigator goes here
import {createBottomTabNavigator} from 'react-navigation';
import {createStackNavigator} from "react-navigation";
import { Icon } from 'react-native-elements';
import React from 'react';

import HomeFeed from '../screens/homefeed';
import TilePage from '../screens/tilePage'
import ProfileScreen from "../screens/profile";
import FriendFeed from "../screens/friendfeed"
import UserScreen from "../screens/friendProfile";
import Username from "../components/image/username";

export const HomeStack = createStackNavigator({
  Explore:{
    screen: HomeFeed,
  },
  User: {
    screen: UserScreen,
  },
  Tile: {
    screen: TilePage,
  },

},
  {
    initialRouteName: "Explore"
  });

export const FriendStack = createStackNavigator({
  Friend:{
    screen: FriendFeed,
  },
  User: {
    screen: UserScreen,
  },
  Tile: {
    screen: TilePage,
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
  Tile: {
    screen: TilePage,
  },

},
  {
    initialRouteName: "Profile"
})


const MainRouter = createBottomTabNavigator({
  Home: {
    screen: FriendStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="home" size={35} color={tintColor} />
    }
  },
  Explore:{
    screen: HomeStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="search" size={35} color={tintColor} />
    },
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="face" size={35} color={tintColor} />
    },
  },

});

export default MainRouter;
