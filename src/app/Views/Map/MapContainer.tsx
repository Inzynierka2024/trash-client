import MapLibreGL from "@maplibre/maplibre-react-native";
import { StyleSheet, View } from "react-native";

export const MapContainer = () => {
  return (
    <View style={{ height: "100%", width: "100%" }}>
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
