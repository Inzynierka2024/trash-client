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
        attributionEnabled={true}
        style={styles.map}
        logoEnabled={false}
      >
        <MapLibreGL.RasterSource
          id="OSMSource"
          tileSize={256}
          maxZoomLevel={19}
          // FIXME: add attribution corrctly
          // @ts-ignore
          attribution="&copy; OpenStreetMap Contributors"
          tileUrlTemplates={[
            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
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
