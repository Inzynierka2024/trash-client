import { StatusBar } from "expo-status-bar";
import MapLibreGL, { Logger } from "@maplibre/maplibre-react-native";
import React, { useState } from "react";
import { ThemeContext, darkTheme, theme } from "./src/theme/theme";
import { Button, useColorScheme, StyleSheet, View, Modal } from "react-native";
import { DebugOptions } from "./src/app/Views/Debug/DebugOptions";
import { OptionsContext } from "./src/app/Logic/StateProvider";
import AppNavigator from "./src/app/Logic/Navigation/AppNavigator";
import { AuthProvider } from "./src/app/Logic/AuthContext";

// Will be null for most users (only Mapbox authenticates this way).
// Required on Android. See Android installation notes.
MapLibreGL.setAccessToken(null);
Logger.setLogLevel("error");

export default function App() {
  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false
  );

  const [debugVisible, setDebugVisible] = useState(false);

  // Options
  const [API_URL, setApiUrl] = useState<string>("192.168.43.40:5000");

  return (
    <AuthProvider>
      <OptionsContext.Provider value={{ API_URL }}>
        <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
          <AppNavigator>
            <StatusBar style={darkMode ? "dark" : "light"} />
            <View style={styles.debugButton}>
              <Button
                onPress={() => {
                  setDebugVisible(true);
                }}
                title="Debug"
              ></Button>
            </View>

            <Modal
              visible={debugVisible}
              onRequestClose={() => {
                setDebugVisible(false);
              }}
            >
              <DebugOptions setApi={setApiUrl} />
            </Modal>
          </AppNavigator>
        </ThemeContext.Provider>
      </OptionsContext.Provider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
    marginLeft: 8,
    marginTop: 24,
  },
});
