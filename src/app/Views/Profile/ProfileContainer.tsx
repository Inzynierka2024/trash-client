import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from '../../Logic/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default class ProfileContainer extends Component {
  render() {
    const { authState, onLogout } = useAuth();
    return (
    <NavigationContainer> I
    <Stack.Navigator>
      {
        authState?.authenticated ? (
          <Stack.Screen name="Profile" component={ProfileForm}></Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={LoginForm}></Stack.Screen>
        )
      }
    </Stack.Navigator>
    </NavigationContainer>
    )
  }
}