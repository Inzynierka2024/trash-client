import { StatusBar } from "expo-status-bar";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { Main } from "./src/app/Main";
import React, { useState } from "react";
import { ThemeContext, darkTheme, theme } from "./src/theme/theme";
import { Button, useColorScheme, StyleSheet, View, Modal } from "react-native";
import { DebugOptions } from "./src/app/Views/Debug/DebugOptions";
import { OptionsContext } from "./src/app/Logic/StateProvider";

// Will be null for most users (only Mapbox authenticates this way).
// Required on Android. See Android installation notes.
MapLibreGL.setAccessToken(null);

export default function App() {
  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false
  );

  const [debugVisible, setDebugVisible] = useState(false);

  // Options
  const [API_URL, setApiUrl] = useState("0.0.0.0:8080");

  return (
    <OptionsContext.Provider value={{ API_URL }}>
      <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
        <StatusBar style="auto" />
        <Main></Main>
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
      </ThemeContext.Provider>
    </OptionsContext.Provider>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    position: "absolute",
    marginLeft: 8,
    marginTop: 24,
  },
});
