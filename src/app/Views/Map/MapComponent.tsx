import MapLibreGL, { SymbolLayerStyle } from "@maplibre/maplibre-react-native";
import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  useColorScheme,
  Modal,
  StyleProp,
  Image,
  Button,
} from "react-native";
import { ThemeContext, theme } from "../../../theme/theme";
import { MapButton } from "./MapButton";
import { TrashForm } from "../New/TrashForm";
import exampleIcon from "../../../../assets/marker.png";
import get_api_url from "../../Utils/get_api_url";
import get_all_trash from "../../Logic/API/get_all_trash";
import get_trash_photo from "../../Logic/API/get_trash_photo";
import remove_trash from "../../Logic/API/remove_trash";

export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
}

export const MapComponent = () => {
  const themeFromContext = useContext(ThemeContext);

  const MAPTILER_API_KEY = "vX05uJQEE4mrjJmQSrG4";
  const API_URL = get_api_url();

  const [userState, setUserState] = useState<MapLibreGL.Location>({
    coords: { latitude: 0, longitude: 0 },
  });

  const [markers, setMarkers] = useState<MarkerData[]>([]);

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
  const [trashModalVisible, setTrashModalVisible] = useState(false);

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

  function updateMapMarkers() {
    get_all_trash(API_URL)
      .then((data) => {
        console.log(data);
        const points = data["map_points"];
        setMarkers(points);
      })
      .catch((err) => {
        console.error("Fetch error", err);
      });
  }

  useEffect(() => {
    updateMapMarkers();
  }, []);

  const mappedFeatures: any = markers.map((marker) => {
    const { lat, lng, id } = marker;

    return {
      type: "Feature",
      id,
      properties: {},
      geometry: { type: "Point", coordinates: [lng, lat] },
    };
  });

  const featureCollection: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: mappedFeatures,
  };

  const [currentTrashId, setCurrentTrashId] = useState(-1);
  const [currentTrashPhoto, setCurrentTrashPhoto] = useState("");

  function showTrashData(id: number) {
    setCurrentTrashId(id);
    setTrashModalVisible(true);

    console.log(`Fetching ${id} photo`);

    get_trash_photo(API_URL, id)
      .then((data) => {
        setCurrentTrashPhoto(data["image"]);
      })
      .catch((err) => {
        console.error("Fetch photo error", err);
      });
  }

  function closeTrashModal() {
    setTrashModalVisible(false);
    setCurrentTrashPhoto("");
    setCurrentTrashId(-1);
  }

  function onPinPress(event: any) {
    const id = event["features"][0]["id"];
    showTrashData(id);
  }

  function removeTrash() {
    remove_trash(API_URL, currentTrashId)
      .then((data) => {
        console.log("Removed trash");
        updateMapMarkers();
      })
      .catch((err) => {
        console.log("Failed to remove trash");
      })
      .finally(() => {
        closeTrashModal();
      });
  }

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
        <TrashForm
          location={userState}
          setModal={setCameraModalVisible}
          updateMap={updateMapMarkers}
        />
      </Modal>

      <Modal
        animationType="slide"
        visible={trashModalVisible}
        onRequestClose={() => {
          closeTrashModal();
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: themeFromContext.colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{
              uri: "data:image/jpg;base64," + currentTrashPhoto,
            }}
            style={{
              aspectRatio: "9 / 16",
              height: 300,
              resizeMode: "contain",
            }}
          />

          <Button title="Usuń" onPress={removeTrash}></Button>
        </View>
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
          triggerKey={cameraTrigger}
        />

        <MapLibreGL.ShapeSource
          id="pinsSource"
          shape={featureCollection}
          onPress={onPinPress}
        >
          <MapLibreGL.SymbolLayer id="pinsLayer" style={pinLayerStyle} />
        </MapLibreGL.ShapeSource>
      </MapLibreGL.MapView>
    </View>
  );
};

const pinLayerStyle: StyleProp<SymbolLayerStyle> = {
  iconAllowOverlap: true,
  iconAnchor: "bottom",
  iconSize: 1.0,
  iconImage: exampleIcon,
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

  annotationContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.45)",
    borderRadius: 45 / 2,
    borderWidth: StyleSheet.hairlineWidth,
    height: 45,
    justifyContent: "center",
    overflow: "hidden",
    width: 45,
  },
});
