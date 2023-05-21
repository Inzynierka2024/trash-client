import { useContext } from "react";
import { Alert, Image, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableWithoutFeedback, Pressable, View} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { ThemeContext } from "../../../theme/theme";
import Ionicons from 'react-native-ionicons';
import { Button, SocialIcon } from "react-native-elements";
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileForm from './ProfileForm';
import LoginForm from './LoginForm';

const Stack = createStackNavigator();

export const ProfileContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const themeFromContext = useContext(ThemeContext);

  return (
    
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="Profile" component={ProfileForm} />
        ) : (
          <Stack.Screen name="Login" component={LoginForm} />
        )}
      </Stack.Navigator>
    
  );
};

