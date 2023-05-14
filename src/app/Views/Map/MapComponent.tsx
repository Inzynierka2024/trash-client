import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { ThemeContext } from "../../../theme/theme";
import { MaterialIcons } from "@expo/vector-icons";

export const MapComponent = () => {
  const themeFromContext = useContext(ThemeContext);

  const MAPTILER_API_KEY = "vX05uJQEE4mrjJmQSrG4";

  const [userState, setUserState] = useState<MapLibreGL.Location>({
    coords: { latitude: 0, longitude: 0 },
  });

  function onUserLocationUpdate(location: MapLibreGL.Location) {
    setUserState(location);
  }

  // FIXME: sometimes user marker doesnt appear?

  function flyToUser() {
    if (!userState.coords || !CameraRef) return;

    CameraRef.flyTo(
      [userState.coords.latitude, userState.coords.longitude],
      500
    );

    triggerUpdate("camera");
  }

  const [cameraTrigger, triggerCamera] = useState(false);

  function triggerUpdate(key: "camera") {
    if (key === "camera") triggerCamera(!cameraTrigger);
  }

  // References to call methods on map elements
  let MapRef: MapLibreGL.MapView = undefined;
  let CameraRef: MapLibreGL.Camera = undefined;

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        backgroundColor: themeFromContext.colors.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.operationContainer}>
        <MaterialIcons.Button
          onPress={() => {
            flyToUser();
          }}
          name="center-focus-weak"
          size={28}
          borderRadius={8}
          color={themeFromContext.colors.primaryText}
          backgroundColor={themeFromContext.colors.primary}
          iconStyle={styles.operationIcon}
        ></MaterialIcons.Button>
      </View>

      <MapLibreGL.MapView
        compassViewPosition={1}
        compassViewMargins={{ x: 10, y: 30 }}
        ref={(c) => (MapRef = c)}
        attributionEnabled={true}
        style={styles.map}
        logoEnabled={false}
      >
        <MapLibreGL.UserLocation
          visible={true}
          onUpdate={onUserLocationUpdate}
          showsUserHeadingIndicator={true}
          onPress={() => {
            console.log("On user location press");
          }}
        />
        <MapLibreGL.Camera
          ref={(c) => (CameraRef = c)}
          followUserMode="compass"
          followUserLocation={true}
          animationMode="flyTo"
          animationDuration={5000}
          onUserTrackingModeChange={() => {
            console.log("???");
          }}
          triggerKey={cameraTrigger}
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

  operationContainer: {
    position: "absolute",
    zIndex: 9999,
    right: 0,
    bottom: 0,
    margin: 16,
  },

  operationIcon: {
    marginRight: 0,
  },
});
