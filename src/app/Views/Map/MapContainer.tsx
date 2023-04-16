import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../theme/theme";

export const MapContainer = () => {
  const themeFromContext = useContext(ThemeContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeFromContext.colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MapLibreGL.MapView
        style={styles.map}
        logoEnabled={false}
        styleURL="https://demotiles.maplibre.org/style.json"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
});
