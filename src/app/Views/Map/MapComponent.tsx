import MapLibreGL from "@maplibre/maplibre-react-native";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, useColorScheme, Modal } from "react-native";
import { ThemeContext, theme } from "../../../theme/theme";
import { MapButton } from "./MapButton";
import { TrashForm } from "../New/TrashForm";

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

  const [cameraModalVisible, setCameraModalVisible] = useState(false);

  function addNew() {
    setCameraModalVisible(true);
  }

  const [cameraTrigger, triggerCamera] = useState(false);

  function triggerUpdate(key: "camera") {
    if (key === "camera") triggerCamera(!cameraTrigger);
  }

  // References to call methods on map elements
  let MapRef: MapLibreGL.MapView = undefined;
  let CameraRef: MapLibreGL.Camera = undefined;
  let UserLocationRef: MapLibreGL.UserLocation = undefined;

  const MapTileURL =
    useColorScheme() === "dark"
      ? `https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`
      : `https://api.maptiler.com/maps/openstreetmap/{z}/{x}/{y}.jpg?key=${MAPTILER_API_KEY}`;

  const mapStyleURL =
    useColorScheme() === "dark"
      ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_API_KEY}`
      : `https://api.maptiler.com/maps/openstreetmap/style.json?key=${MAPTILER_API_KEY}`;

  useEffect(() => {
    async function loadTrash() {
      const response = await fetch("https://httpbin.org/get");
      const json = await response.json();

      return json;
    }

    loadTrash().then((data) => {
      console.log("GET: ", data);
    });
  }, []);

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
      <Modal
        animationType="slide"
        visible={cameraModalVisible}
        onRequestClose={() => {
          setCameraModalVisible(false);
        }}
      >
        <TrashForm location={userState} />
      </Modal>

      <View style={styles.operationContainer}>
        <MapButton iconName="center-focus-weak" onPress={flyToUser} />
        <MapButton iconName="add" onPress={addNew} />
      </View>

      <MapLibreGL.MapView
        compassViewPosition={1}
        compassViewMargins={{
          x: themeFromContext.spacing.m,
          y: themeFromContext.spacing.xl,
        }}
        styleURL={mapStyleURL}
        ref={(c) => (MapRef = c)}
        attributionEnabled={true}
        style={styles.map}
        logoEnabled={false}
      >
        <MapLibreGL.UserLocation
          ref={(c) => (UserLocationRef = c)}
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
          tileSize={512}
          maxZoomLevel={19}
          tileUrlTemplates={[MapTileURL]}
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
    margin: theme.spacing.m,
    gap: theme.spacing.s,
  },
});
