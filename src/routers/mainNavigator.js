// Main tabbed navigator goes here
import {createBottomTabNavigator} from 'react-navigation';

import HomeFeed from '../screens/homefeed';
import ProfileScreen from "../screens/profile";
import FriendFeed from "../screens/friendfeed"
import SearchTest from "../screens/siddhiTest"

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

});

export default MainRouter;
