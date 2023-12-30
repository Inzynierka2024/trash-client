import React, { useState } from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import _fetch from '../../Logic/API/_fetch';
import { theme } from "../../../theme/theme";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Scoreboard } from "./Scoreboard"
import { Leaderboard } from "./Leaderboard"

const RankingContainer = () => {
  const Tab = createMaterialTopTabNavigator();
  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <Tab.Navigator
        initialRouteName="Scoreboard"
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: theme.colors.background },
          tabBarIndicatorStyle: { backgroundColor: theme.colors.primary },
        }}
      >
        <Tab.Screen name="Scoreboard" component={Scoreboard} />
        <Tab.Screen name="Leaderboard" component={Leaderboard} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default RankingContainer;
