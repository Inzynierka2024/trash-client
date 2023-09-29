import React from "react";
import { useContext } from "react";
import { useColorScheme } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import LoginForm from "../../Views/Profile/LoginForm";
import RegisterForm from "../../Views/Profile/RegisterForm";
import ProfileForm from "../../Views/Profile/ProfileForm";
import ProfileEditForm from "../../Views/Profile/ProfileEditForm";
import ProfileStatsForm from "../../Views/Profile/ProfileStatsForm";
import ProfileTrashForm from "../../Views/Profile/ProfileTrashForm";
import SettingsForm from "../../Views/Profile/SettingsForm";
import RankingContainer from "../../Views/Ranking/RankingContainer";
import { MapContainer } from "../../Views/Map/MapContainer";
import ProfileContainer from "../../Views/Profile/ProfileContainer";
import GuildsForm from "../../Views/Guilds/GuildsForm";
import GuildDetailsForm from "../../Views/Guilds/GuildDetailsForm";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { CTheme, ThemeContext } from "../../../theme/theme";

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="Container" component={ProfileContainer} />
      <ProfileStack.Screen name="Login" component={LoginForm} />
      <ProfileStack.Screen name="Register" component={RegisterForm} />
      <ProfileStack.Screen name="Profile" component={ProfileForm} />
      <ProfileStack.Screen name="CollectedTrash" component={ProfileTrashForm} />
      <ProfileStack.Screen name="Settings" component={SettingsForm} />
      <ProfileStack.Screen name="ProfileStats" component={ProfileStatsForm} />
      <ProfileStack.Screen name="ProfileEdit" component={ProfileEditForm} />
      <ProfileStack.Screen name="Guilds" component={GuildsForm} />
      <ProfileStack.Screen name="Guild" component={GuildDetailsForm} />
    </ProfileStack.Navigator>
  );
};

const AppNavigator = () => {
  const themeFromContext: CTheme = useContext(ThemeContext);

  return (
    <NavigationContainer
      theme={useColorScheme() === "dark" ? DarkTheme : DefaultTheme}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let provider: "Ionicons" | "FontAwesome" = "Ionicons";
            let iconName = "trash";

            if (route.name === "Ranking") {
              provider = "Ionicons";
              iconName = "medal";
            }
            if (route.name === "Map") {
              provider = "Ionicons";
              iconName = "map";
            }
            if (route.name === "Profil") {
              provider = "FontAwesome";
              iconName = "user";
            }

            if (provider === "FontAwesome") {
              if (!focused) iconName += "-o";
              return <FontAwesome name={iconName} size={size} color={color} />;
            } else {
              if (!focused) iconName += "-outline";
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: themeFromContext.colors.primary,
          tabBarInactiveTintColor: themeFromContext.colors.disabled,
        })}
      >
        <Tab.Screen name="Ranking" component={RankingContainer} />
        <Tab.Screen name="Map" component={MapContainer} />
        <Tab.Screen name="Profil" component={ProfileStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
