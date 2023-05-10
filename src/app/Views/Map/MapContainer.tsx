import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ThemeContext } from "../../../theme/theme";

export const MapContainer = () => {
  const themeFromContext = useContext(ThemeContext);

  const MAPTILER_API_KEY = "vX05uJQEE4mrjJmQSrG4";

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
        attributionEnabled={true}
        style={styles.map}
        logoEnabled={false}
        attributionPosition={{ bottom: 8, right: 8 }}
      >
        <MapLibreGL.Camera
          defaultSettings={{ centerCoordinate: [20, 50], zoomLevel: 3 }}
        />
        <MapLibreGL.RasterSource
          id="OSMSource"
          tileSize={256}
          maxZoomLevel={19}
          tileUrlTemplates={[
            `https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`,
          ]}
        >
          <MapLibreGL.RasterLayer
            id="OSMLayer"
            sourceID="OSMSource"
            style={{ rasterOpacity: 1 }}
          ></MapLibreGL.RasterLayer>
        </MapLibreGL.RasterSource>
      </MapLibreGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
});
