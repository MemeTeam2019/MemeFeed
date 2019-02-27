// Main tabbed navigator goes here
import {createBottomTabNavigator} from 'react-navigation';
import {createStackNavigator} from "react-navigation";

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


const MainRouter = createBottomTabNavigator({
  Home: {
    screen: FriendStack
  },
  Explore:{
    screen: HomeStack
  },
  Profile: {
    screen: ProfileScreen
  },
  FriendProfile: {
    screen: FriendProfileScreen
  }
});

export default MainRouter;
