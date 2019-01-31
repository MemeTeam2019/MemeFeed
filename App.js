import React from 'react';
import {AsyncStorage} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import firebase from 'react-native-firebase';

import AuthRouter from './src/routers/authNavigator';
import MainRouter from './src/routers/mainNavigator';

export default createAppContainer(createSwitchNavigator(
  {
    Auth: {
      screen: AuthRouter
    },
    Main: {
      screen: MainRouter
    }
  },
  {
    initialRouteName: 'Auth'
  }
));
