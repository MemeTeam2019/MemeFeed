// Main tabbed navigator goes here
import {createBottomTabNavigator} from 'react-navigation';

import HomeFeed from '../screens/homefeed';
import ProfileScreen from "../screens/profile";
// import HomeFeed from '../screens/miatest';

const MainRouter = createBottomTabNavigator({
  Home: {
    screen: HomeFeed
  },
  Profile: {
    screen: ProfileScreen
  }
});

export default MainRouter;
