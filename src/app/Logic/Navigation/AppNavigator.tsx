import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import LoginForm from '../../Views/Profile/LoginForm';
import RegisterForm from '../../Views/Profile/RegisterForm';
import ProfileForm from '../../Views/Profile/ProfileForm';
import ProfileEditForm from '../../Views/Profile/ProfileForm';
import ProfileStatsForm from '../../Views/Profile/ProfileForm';
import ProfileTrashForm from '../../Views/Profile/ProfileForm';
import SettingsForm from '../../Views/Profile/ProfileForm';
import { RankingContainer } from '../../Views/Ranking/RankingContainer';
import { MapContainer } from '../../Views/Map/MapContainer';
import ProfileContainer from '../../Views/Profile/ProfileContainer';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={{
    headerShown: false
  }}>
    <ProfileStack.Screen name="Login" component={LoginForm} />
    <ProfileStack.Screen name="Register" component={RegisterForm} />
    <ProfileStack.Screen name="Profile" component={ProfileForm} />
    <ProfileStack.Screen name="Collected Trash" component={ProfileTrashForm} />
    <ProfileStack.Screen name="Settings" component={SettingsForm} />
    <ProfileStack.Screen name="Stats" component={ProfileStatsForm} />
    <ProfileStack.Screen name="Profile Edit" component={ProfileEditForm} />
  </ProfileStack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Tab.Navigator screenOptions={{
    headerShown: false
  }}>
      <Tab.Screen name="Ranking" component={RankingContainer} />
      <Tab.Screen name="Map" component={MapContainer} />
      <Tab.Screen name="Profil" component={ProfileStackNavigator} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
