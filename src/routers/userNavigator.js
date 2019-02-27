// Main tabbed navigator goes here
import {createStackNavigator} from "react-navigation";

import HomeFeed from '../screens/homefeed';
import UserScreen from "../screens/userpg";
import Username from "../components/image/username";

const UserStack = createStackNavigator({
  Username:{
    screen: Username,
  },
  User: {
    screen: UserScreen,
  },

},
  {
    initialRouteName: "Username"
  });
export default UserStack;