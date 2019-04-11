import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import { Icon } from 'react-native-elements';

import ExploreFeed from '../screens/exploreFeed';
import TilePage from '../screens/tilePage';
import Profile from '../screens/profilePage';
import HomeFeed from '../screens/homeFeed';
import FriendProfile from '../screens/friendProfileScreen';
import CommentPage from '../screens/commentPage';
import { FollowList } from '../components/home/searchResult';

export const ExploreStack = createStackNavigator(
  {
    Explore: {
      screen: ExploreFeed,
    },
    FriendProfile: {
      screen: FriendProfile,
    },
    Tile: {
      screen: TilePage,
    },
    FollowList: {
      screen: FollowList,
    },
    Comment: {
      screen: CommentPage,
    },
  },
  {
    initialRouteName: 'Explore',
  }
);

export const HomeStack = createStackNavigator(
  {
    Friend: {
      screen: HomeFeed,
    },
    FriendProfile: {
      screen: FriendProfile,
    },
    Tile: {
      screen: TilePage,
    },
    Comment: {
      screen: CommentPage,
    },
    FollowList: {
      screen: FollowList,
    },
  },
  {
    initialRouteName: 'Friend',
  }
);

export const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
    },
    FriendProfile: {
      screen: FriendProfile,
    },
    Tile: {
      screen: TilePage,
    },
    FollowList: {
      screen: FollowList,
    },
    Comment: {
      screen: CommentPage,
    },
  },
  {
    initialRouteName: 'Profile',
  }
);

const MainRouter = createBottomTabNavigator({
  Home: {
    screen: HomeStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" size={28} color={tintColor} />
      ),
      tabBarOptions:{
        showLabel: false,
        showIcon: true
      }
    },
    
  },
  Explore: {
    screen: ExploreStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => (
        <Icon name="search" size={28} color={tintColor} />
      ),
      tabBarOptions:{
        showLabel: false,
        showIcon: true
      }
    },
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => (
        <Icon name="face" size={28} color={tintColor} />
      ),
      tabBarOptions:{
        showLabel: false,
        showIcon: true
      }
    },
  },
});

export default MainRouter;
