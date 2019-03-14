import {createStackNavigator} from "react-navigation";

import LoginScreen from '../screens/login';
import SignupScreen from '../screens/signup';
import ConfirmScreen from '../screens/confirm';
import AboutScreen from '../screens/about';
// import HomeFeed from '../screens/homefeed'

export default createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Signup: {
      screen: SignupScreen
    },
    About: {
      screen: AboutScreen
    },
    Confirm: {
      screen: ConfirmScreen
    },
  },
  {
    initialRouteName: "Login"
  }
);
