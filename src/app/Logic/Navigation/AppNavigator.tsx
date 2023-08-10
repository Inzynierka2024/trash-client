import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import LoginForm from '../../Views/Profile/LoginForm';
import RegisterForm from '../../Views/Profile/RegisterForm';
import ProfileForm from '../../Views/Profile/ProfileForm';
import { RankingContainer } from '../../Views/Ranking/RankingContainer';
import { MapContainer } from '../../Views/Map/MapContainer';
import ProfileContainer from '../../Views/Profile/ProfileContainer';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Login" component={LoginForm} />
    <ProfileStack.Screen name="Register" component={RegisterForm} />
    <ProfileStack.Screen name="Profile" component={ProfileForm} />
  </ProfileStack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen name="Ranking" component={RankingContainer} />
      <Tab.Screen name="Map" component={MapContainer} />
      <Tab.Screen name="Profil" component={ProfileStackNavigator} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
