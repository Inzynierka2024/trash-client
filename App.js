import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapLibreGL from "@maplibre/maplibre-react-native";

// Will be null for most users (only Mapbox authenticates this way).
// Required on Android. See Android installation notes.
MapLibreGL.setAccessToken(null);

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapLibreGL.MapView
        style={styles.map}
        logoEnabled={false}
        styleURL="https://demotiles.maplibre.org/style.json"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
});
