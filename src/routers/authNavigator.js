import {createStackNavigator} from "react-navigation";

import LoginScreen from '../screens/loginPage';
import SignupScreen from '../screens/signupPage';
import ConfirmScreen from '../screens/confirmPage';
import AboutScreen from '../screens/aboutPage';
import AboutScreen2 from '../screens/aboutPage2';
import AboutScreen3 from '../screens/aboutPage3';

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
    About2: {
      screen: AboutScreen2
    },
    About3: {
      screen: AboutScreen3
    },
    Confirm: {
      screen: ConfirmScreen
    },
  },
  {
    initialRouteName: "Login"
  }
);
