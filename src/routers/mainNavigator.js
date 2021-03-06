import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import { Icon } from 'react-native-elements';

import ExploreFeed from '../screens/exploreFeed';
import TilePage from '../screens/tilePage';
import Profile from '../screens/profilePage';
import HomeFeed from '../screens/homeFeed';
import FriendProfile from '../screens/friendProfileScreen';
import CommentPage from '../screens/commentPage';
import FollowList from '../components/home/searchResultList';
import CaptionPage from '../screens/captionPage';
import NotePage from '../screens/notePage';
import SubReddit from '../screens/subReddit';
import aboutInfo1 from '../screens/aboutInfo1';
import aboutInfo2 from '../screens/aboutInfo2';
import aboutInfo3 from '../screens/aboutInfo3';
import PrivacyPolicyScreen from '../screens/privacyScreen';
import EditProfilePic from '../screens/editProfilePic';

const InfoStack = createStackNavigator({
  aboutInfo1,
  aboutInfo2,
  aboutInfo3,
});

const ExploreStack = createStackNavigator(
  {
    Explore: {
      screen: ExploreFeed,
    },
    FriendProfile: {
      screen: FriendProfile,
    },
    Tile: {
      screen: TilePage,
    },
    FollowList: {
      screen: FollowList,
    },
    Comment: {
      screen: CommentPage,
    },
    SubReddit: {
      screen: SubReddit,
    }
  },
  {
    initialRouteName: 'Explore',
  }
);

const HomeStack = createStackNavigator(
  {
    Friend: {
      screen: HomeFeed,
    },
    FriendProfile: {
      screen: FriendProfile,
    },
    Tile: {
      screen: TilePage,
    },
    Comment: {
      screen: CommentPage,
    },
    FollowList: {
      screen: FollowList,
    },
    SubReddit: {
      screen: SubReddit,
    }
  },
  {
    initialRouteName: 'Friend',
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
    },
    FriendProfile: {
      screen: FriendProfile,
    },
    Tile: {
      screen: TilePage,
    },
    FollowList: {
      screen: FollowList,
    },
    Comment: {
      screen: CommentPage,
    },
    InfoStack: {
      screen: InfoStack,
    },
    Privacy: {
      screen: PrivacyPolicyScreen,
    },
    SubReddit: {
      screen: SubReddit,
    },
    ProfilePic: {
      screen: EditProfilePic
    }
  },
  {
    initialRouteName: 'Profile',
  }
);
const NoteStack = createStackNavigator(
   {
    Note: {
      screen: NotePage,
    },
    FriendProfile: {
      screen: FriendProfile,
    },
    Comment: {
      screen: CommentPage,
    },
    FollowList: {
      screen: FollowList,
    },
  },
  {
    initialRouteName: 'Note',
  }

);

const UploadStack = createStackNavigator(
  {
    CaptionPage: {
      screen: CaptionPage,
    }
  },
  {
    initialRouteName: 'CaptionPage'
  }
);

const MainRouter = createBottomTabNavigator({

  Home: {
    screen: HomeStack,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => (
        <Icon name='home' size={28} color={tintColor} />
      ),
      tabBarOptions: {
        showLabel: false,
        showIcon: true,
        activeTintColor: '#000000',
        inactiveTintColor: '#D3D3D3',
        style: {
          height: '9%',
        },
      },
    },
  },
  Explore: {
    screen: ExploreStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => (
        <Icon name='search' size={28} color={tintColor} />
      ),
      tabBarOptions: {
        showLabel: false,
        showIcon: true,
        activeTintColor: '#000000',
        inactiveTintColor: '#D3D3D3',
        style: {
          height: '9%',
        },
      },
    },
  },

  Upload:{
    screen: UploadStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => (
        <Icon name='image' size={35} color={tintColor} />
      ),

      tabBarOptions: {
        showLabel: false,
        showIcon: true,
        activeTintColor: '#000000',
        inactiveTintColor: '#D3D3D3',
        style: {
          height: '9%',
        },
      },
    },
  },
  Note: {
    screen: NoteStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => (
        <Icon name='notifications' size={28} color={tintColor} />
      ),

      tabBarOptions: {
        showLabel: false,
        showIcon: true,
        activeTintColor: '#000000',
        inactiveTintColor: '#D3D3D3',
        style: {
          height: '9%',
        },
      },
    },
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      showLabel: false,
      tabBarIcon: ({ tintColor }) => (
        <Icon name='face' size={28} color={tintColor} />
      ),
      tabBarOptions: {
        showLabel: false,
        showIcon: true,
        activeTintColor: '#000000',
        inactiveTintColor: '#D3D3D3',
        style: {
          height: '9%',
        },
      },
    },
  },
});

export default MainRouter;
