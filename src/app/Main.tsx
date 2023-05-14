import React, { useContext, useState } from "react";
import { UIManager, useColorScheme, useWindowDimensions } from "react-native";
import { MapContainer } from "./Views/Map/MapContainer";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { ProfileContainer } from "./Views/Profile/ProfileContainer";
import { RankingContainer } from "./Views/Ranking/RankingContainer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ThemeContext } from "../theme/theme";

const Tab = createBottomTabNavigator();

export const Main = () => {
  const themeFromContext = useContext(ThemeContext);

  return (
    <NavigationContainer
      theme={useColorScheme() === "dark" ? DarkTheme : DefaultTheme}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Ranking"
          component={RankingContainer}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="Trophy" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Mapa"
          component={MapContainer}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="compass"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfileContainer}
          options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
