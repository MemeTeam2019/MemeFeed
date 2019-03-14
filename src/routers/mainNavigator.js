// Main tabbed navigator goes here
import { createBottomTabNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import React from 'react';

import HomeFeed from '../screens/homefeed';
import TilePage from '../screens/tilePage'
import ProfileScreen from "../screens/profile";
import FriendFeed from "../screens/friendfeed"
import UserScreen from "../screens/friendProfile";
import CommentPage from "../screens/CommentPage";

import { FollowList } from '../components/home/SearchResults'

export const HomeStack = createStackNavigator(
  {
    Explore: {
      screen: HomeFeed,
    },
    User: {
      screen: UserScreen,
    },
    Tile: {
      screen: TilePage,
    },
    FollowList: {
      screen: FollowList
    }
  },
  {
    initialRouteName: 'Explore',
  }
);

export const FriendStack = createStackNavigator(
  {
    Friend: {
      screen: FriendFeed,
    },
    User: {
      screen: UserScreen,
    },
    Tile: {
      screen: TilePage,
    },
    Comment: {
      screen: CommentPage
    },
    FollowList: {
      screen: FollowList
    }
  },
  {
    initialRouteName: 'Friend',
  }
);

export const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
    },
    User: {
      screen: UserScreen,
    },
    Tile: {
      screen: TilePage,
    },
    FollowList: {
      screen: FollowList,
    },
  },
  {
    initialRouteName: 'Profile',
  }
);

const MainRouter = createBottomTabNavigator({
  Home: {
    screen: FriendStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => <Icon name="home" size={35} color={tintColor} />
    }
  },
  Explore: {
    screen: HomeStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => <Icon name="search" size={35} color={tintColor} />
    },
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => <Icon name="face" size={35} color={tintColor} />
    },
  },

});

export default MainRouter;
