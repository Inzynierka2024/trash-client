import React, { useState } from "react";
import { UIManager, useWindowDimensions } from "react-native";
import { MapContainer } from "./Views/Map/MapContainer";
import { NavigationContainer } from "@react-navigation/native";
import { ProfileContainer } from "./Views/Profile/ProfileContainer";
import { RankingContainer } from "./Views/Ranking/RankingContainer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
UIManager


const Tab = createBottomTabNavigator();

export const Main = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Ranking" component={RankingContainer} />
        <Tab.Screen name="Mapa" component={MapContainer} />
        <Tab.Screen name="Profil" component={ProfileContainer} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
