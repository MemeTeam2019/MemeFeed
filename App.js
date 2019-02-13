import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import LoadingScreen from "./src/screens/loading";
import AuthRouter from './src/routers/authNavigator';
import MainRouter from './src/routers/mainNavigator';
import Tile from './src/components/image/Tile';

export default createAppContainer(createSwitchNavigator(
  {
    Loading: {
      screen: LoadingScreen
    },
    Auth: {
      screen: AuthRouter
    },
    Main: {
      screen: MainRouter
    }
  },
  {
    initialRouteName: "Loading"
  }
));
