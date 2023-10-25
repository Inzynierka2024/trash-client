import { StatusBar } from "expo-status-bar";
import MapLibreGL, { Logger } from "@maplibre/maplibre-react-native";
import { useState, useEffect } from "react";
import { ThemeContext, darkTheme, palette, theme } from "./src/theme/theme";
import {
  Button,
  useColorScheme,
  StyleSheet,
  View,
  Modal,
  TextInput,
  Text,
} from "react-native";
import AppNavigator from "./src/app/Logic/Navigation/AppNavigator";
import { AuthProvider } from "./src/app/Logic/AuthContext";
import * as NavigationBar from "expo-navigation-bar";
import get_api_url from "./src/app/Utils/get_api_url";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Will be null for most users (only Mapbox authenticates this way).
// Required on Android. See Android installation notes.
MapLibreGL.setAccessToken(null);
Logger.setLogLevel("error");

export default function App() {
  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false
  );

  useEffect(() => {
    (async () => {
      if (darkMode)
        await NavigationBar.setBackgroundColorAsync(palette.navbardark);
      else await NavigationBar.setBackgroundColorAsync(palette.navbar);
    })();
  }, [darkMode]);

  // Options
  const [debugEnabled, setDebug] = useState(false);

  const [API_URL, setAPI_URL] = useState("");

  // Load api_url on startup
  useEffect(() => {
    (async () => {
      setAPI_URL(await get_api_url());
    })();
  }, []);

  async function updateAPIUrl() {
    await AsyncStorage.setItem("API_URL", API_URL);
  }

  return (
    <AuthProvider>
      <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
        <StatusBar style={!darkMode ? "dark" : "light"} />

        <View style={styles.debugButtonContainer}>
          <Button
            color="#000"
            style={styles.debugButton}
            title="Debug"
            onPress={() => setDebug(!debugEnabled)}
          />
        </View>

        <Modal
          animationType="slide"
          visible={debugEnabled}
          onRequestClose={() => setDebug(false)}
        >
          <View style={styles.debugMenu}>
            <View style={styles.row}>
              <TextInput
                style={styles.textInput}
                onChangeText={setAPI_URL}
                value={API_URL}
              />
              <Button
                title="Update API_URL"
                onPress={() => {
                  updateAPIUrl();
                }}
              />
            </View>
          </View>
        </Modal>

        <AppNavigator></AppNavigator>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  debugButtonContainer: {
    position: "absolute",
    height: 128,
    zIndex: 9999,
    width: 80,
    paddingTop: 32,
  },
  debugButton: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  debugMenu: {
    paddingTop: 100,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "black",
    color: "white",
    flex: 1,
  },
});
