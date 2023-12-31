import { useEffect, useContext, useState } from "react";
import { View } from "react-native";
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
import RankingContainer from "../../Views/Ranking/RankingContainer";
import { MapContainer } from "../../Views/Map/MapContainer";
import GuildsForm from "../../Views/Guilds/GuildsForm";
import GuildDetailsForm from "../../Views/Guilds/GuildDetailsForm";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { CTheme, ThemeContext } from "../../../theme/theme";
import { useAuth } from "../AuthContext";
import { RecyclingScreen } from "../../Views/Recycling/RecyclingScreen";
import ProfileGarbageStatsForm from "../../Views/Profile/ProfileGarbageStatsForm";
import * as SplashScreen from "expo-splash-screen";

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const { state } = useAuth();
  useEffect(() => {
    setInitialRoute(state.isLoggedIn ? "Profile" : "Login");
  }, [state.isLoggedIn]);

  if (!initialRoute) return null;

  return (
    <ProfileStack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <ProfileStack.Screen name="Container" component={ProfileContainer} /> */}
      <ProfileStack.Screen name="Login" component={LoginForm} />
      <ProfileStack.Screen name="Register" component={RegisterForm} />
      <ProfileStack.Screen name="Profile" component={ProfileForm} />
      <ProfileStack.Screen name="CollectedTrash" component={ProfileTrashForm} />
      {/* <ProfileStack.Screen name="Settings" component={SettingsForm} /> */}
      <ProfileStack.Screen name="ProfileStats" component={ProfileStatsForm} />
      <ProfileStack.Screen
        name="ProfileGarbageStats"
        component={ProfileGarbageStatsForm}
      />
      <ProfileStack.Screen name="ProfileEdit" component={ProfileEditForm} />
      <ProfileStack.Screen name="Guilds" component={GuildsForm} />
      <ProfileStack.Screen name="Guild" component={GuildDetailsForm} />
    </ProfileStack.Navigator>
  );
};

const AppNavigator = (props: { darkMode: boolean }) => {
  const themeFromContext: CTheme = useContext(ThemeContext);
  const { isLoggedIn } = useAuth().state;

  useEffect(() => {
    if (isLoggedIn !== null)
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 200);
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn === null ? (
        <View
          style={{
            backgroundColor: themeFromContext.colors.background,
          }}
        ></View>
      ) : (
        <NavigationContainer theme={props.darkMode ? DarkTheme : DefaultTheme}>
          <Tab.Navigator
            initialRouteName={isLoggedIn ? "Map" : "Profil"}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let provider: "Ionicons" | "FontAwesome" = "Ionicons";
                let iconColor = themeFromContext.colors.green;
                let iconName: any = "trash";

                if (route.name === "Ranking") {
                  provider = "Ionicons";
                  iconColor = themeFromContext.colors.yellow;
                  iconName = "medal";
                }
                if (route.name === "Map") {
                  provider = "Ionicons";
                  iconColor = themeFromContext.colors.green;
                  iconName = "map";
                }
                if (route.name === "Profil") {
                  provider = "FontAwesome";
                  iconColor = themeFromContext.colors.blue;
                  iconName = "user";
                }
                if (route.name === "Recycling") {
                  provider = "FontAwesome";
                  iconColor = themeFromContext.colors.danger;
                  iconName = "recycle";
                }

                if (provider === "FontAwesome") {
                  if (!focused) {
                    if (iconName !== "recycle") iconName += "-o";
                    iconColor = themeFromContext.colors.disabled;
                  }
                  return (
                    <FontAwesome
                      name={iconName}
                      size={size}
                      color={iconColor}
                    />
                  );
                } else {
                  if (!focused) {
                    iconColor = themeFromContext.colors.disabled;
                    iconName += "-outline";
                  }
                  return (
                    <Ionicons name={iconName} size={size} color={iconColor} />
                  );
                }
              },
              headerShown: false,
              tabBarShowLabel: false,
              tabBarActiveTintColor: themeFromContext.colors.primary,
              tabBarInactiveTintColor: themeFromContext.colors.disabled,
            })}
          >
            {isLoggedIn === true && (
              <>
                <Tab.Screen name="Ranking" component={RankingContainer} />
                <Tab.Screen name="Map" component={MapContainer} />
              </>
            )}

            <Tab.Screen name="Recycling" component={RecyclingScreen} />
            <Tab.Screen name="Profil" component={ProfileStackNavigator} />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

export default AppNavigator;
