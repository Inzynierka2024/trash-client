import { StatusBar } from "expo-status-bar";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { Main } from "./src/app/Main";
import React, { useContext, useState } from "react";
import { ThemeContext, darkTheme, theme } from "./src/theme/theme";
import { useColorScheme } from "react-native";

// Will be null for most users (only Mapbox authenticates this way).
// Required on Android. See Android installation notes.
MapLibreGL.setAccessToken(null);

export default function App() {
  const [darkMode, setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false
  );

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <StatusBar style="auto" />
      <Main></Main>
    </ThemeContext.Provider>
  );
}
