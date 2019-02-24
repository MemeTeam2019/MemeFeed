// Main tabbed navigator goes here
import {createBottomTabNavigator} from 'react-navigation';

import HomeFeed from '../screens/homefeed';
import ProfileScreen from "../screens/profile";
import FriendFeed from "../screens/friendfeed"
import FriendProfile from "../screens/friendProfile"

const MainRouter = createBottomTabNavigator({
  Home: {
    screen: FriendFeed
  },
  Explore:{
    screen: HomeFeed
  },
  Profile: {
    screen: ProfileScreen
  },
  FriendProPg:{
    screen: FriendProfile
  },

});

export default MainRouter;
