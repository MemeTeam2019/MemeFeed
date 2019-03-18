import {createStackNavigator} from "react-navigation";

import LoginScreen from '../screens/loginPage';
import SignupScreen from '../screens/signupPage';
import ConfirmScreen from '../screens/confirmPage';
import AboutScreen from '../screens/aboutPage';

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
