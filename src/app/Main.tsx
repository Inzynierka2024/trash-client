import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../theme/theme";
import { MapContainer } from "./Views/Map/MapContainer";

export const Main = () => {
  const themeFromContext = useContext(ThemeContext);

  return (
    <>
      <View
        style={{
          ...styles.container,
          backgroundColor: themeFromContext.colors.background,
        }}
      >
        <MapContainer></MapContainer>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
