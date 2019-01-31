import {createStackNavigator} from 'react-navigation';

import LoginScreen from '../screens/login';
import SignupScreen from '../screens/signup';

const AuthRouter = createStackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Signup: {
      screen: SignupScreen
    }
  },
  {
    initialRouteName: 'Login'
  }
);

export default AuthRouter;
