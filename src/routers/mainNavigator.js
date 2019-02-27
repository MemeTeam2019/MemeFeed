// Main tabbed navigator goes here
import {createBottomTabNavigator} from 'react-navigation';
import {createStackNavigator} from "react-navigation";

import HomeFeed from '../screens/homefeed';
import ProfileScreen from "../screens/profile";
import UserScreen from "../screens/userpg";
import Username from "../components/image/username";

export const UserStack = createStackNavigator({
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

const MainRouter = createBottomTabNavigator({
  Home: {
    screen: UserStack
  },
  Profile: {
    screen: ProfileScreen
  },
});

export default MainRouter;
