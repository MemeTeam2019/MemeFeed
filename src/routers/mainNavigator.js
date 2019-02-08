// Main tabbed navigator goes here
import {createBottomTabNavigator} from 'react-navigation';

import HomeFeed from '../screens/homefeed';

const MainRouter = createBottomTabNavigator({
  Home: {
    screen: HomeFeed
  }
});

export default MainRouter;
