import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import LoadingScreen from './src/screens/loadingPage';
import AuthRouter from './src/routers/authNavigator';
import MainRouter from './src/routers/mainNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: {
        screen: LoadingScreen,
      },
      Auth: {
        screen: AuthRouter,
      },
      Main: {
        screen: MainRouter,
      },
    },
    {
      initialRouteName: 'Loading',
    }
  )
);
