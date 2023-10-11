import MapLibreGL, { SymbolLayerStyle } from "@maplibre/maplibre-react-native";
import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  useColorScheme,
  Modal,
  StyleProp,
} from "react-native";
import { ThemeContext, theme } from "../../../theme/theme";
import { TrashForm } from "../New/TrashForm";
import exampleIcon from "../../../../assets/marker.png";
import { TrashModal } from "./TrashModal/TrashModal";
import get_trash_in_area from "../../Logic/API/get_trash_in_area";
import { AddNewButton } from "./Buttons/AddNew";
import { CenterButton } from "./Buttons/CenterButton";
import { SearchNewButton } from "./Buttons/SearchNew";
import { TrashSize } from "../../Models/TrashMetadata";

export interface MarkerData {
  id: number;
  lat: number;
  lng: number;
}

export const MapComponent = () => {
  const themeFromContext = useContext(ThemeContext);

  const MAPTILER_API_KEY = "vX05uJQEE4mrjJmQSrG4";

  const [userState, setUserState] = useState<MapLibreGL.Location>({
    coords: { latitude: 0, longitude: 0 },
  });

  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const [isCentered, setIsCentered] = useState(true);

  function onUserLocationUpdate(location: MapLibreGL.Location) {
    setUserState(location);
  }

  function flyToUser() {
    if (!userState.coords || !CameraRef) return;

    CameraRef.flyTo(
      [userState.coords.latitude, userState.coords.longitude],
      500
    );

    triggerUpdate("camera");
    setIsCentered(true);
  }

  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [trashSize, setTrashSize] = useState<TrashSize | "">("");

  function addNew(type: TrashSize) {
    setCameraModalVisible(true);
    setTrashSize(type);
  }

  const [cameraTrigger, triggerCamera] = useState(false);

  function triggerUpdate(key: "camera") {
    if (key === "camera") triggerCamera(!cameraTrigger);
  }

  // References to call methods on map elements
  let MapRef: MapLibreGL.MapView = undefined;
  let CameraRef: MapLibreGL.Camera = undefined;
  let UserLocationRef: MapLibreGL.UserLocation = undefined;

  const mapStyleURL =
    useColorScheme() === "dark"
      ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_API_KEY}`
      : `https://api.maptiler.com/maps/openstreetmap/style.json?key=${MAPTILER_API_KEY}`;

  async function fetchNewMapMarkers() {
    if (MapRef === null) return;
    const bounds = await MapRef.getVisibleBounds();

    const result = await get_trash_in_area(bounds);

    if (result.isOk) {
      const points = result.data["map_points"];
      return points;
    } else {
      console.error("XD");
      return [];
    }
  }

  async function updateMarkers() {
    const markers = await fetchNewMapMarkers();
    setMarkers(markers);
    updateMapPoints(markers);
  }

  useEffect(() => {
    // Startup intervals
    let markerInv;

    (async () => {
      // Load markers one second after map load
      setTimeout(async () => {
        await updateMarkers();
      }, 1000);

      // Fetch new markers every minute
      markerInv = setInterval(async () => {
        await updateMarkers();
      }, 60000);
    })();

    // Clean up interval
    return () => {
      clearInterval(markerInv);
    };
  }, []);

  // This updates points on a map
  async function updateMapPoints(markers: any[]) {
    setFeatureCollection({
      type: "FeatureCollection",
      features: markers.map((marker) => {
        const { latitude, longitude, id } = marker;

        return {
          type: "Feature",
          id,
          properties: {},
          geometry: { type: "Point", coordinates: [longitude, latitude] },
        };
      }),
    });
  }

  const [featureCollection, setFeatureCollection] =
    useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    });

  const [currentMarker, setCurrentMarker] = useState<MarkerData>(null);
  const [trashModalVisible, setTrashModalVisible] = useState(false);

  async function showTrashData(id: number) {
    const marker = markers.find((e) => e["id"] == id);

    setCurrentMarker(marker);
    setTrashModalVisible(true);
  }

  function onPinPress(event: any) {
    const id = event["features"][0]["id"];
    showTrashData(id);
  }

  function closeTrashModal() {
    setCurrentMarker(null);
    setTrashModalVisible(false);
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
          size={trashSize}
          updateMap={updateMarkers}
        />
      </Modal>

      <TrashModal
        updateMapMarkers={updateMarkers}
        currentTrash={currentMarker}
        trashModalVisible={trashModalVisible}
        onClose={closeTrashModal}
        userState={userState}
      />

      <View style={styles.operationContainer}>
        <AddNewButton newTrash={addNew} newCan={undefined} />
      </View>

      {!isCentered && (
        <View style={styles.actionsContainer}>
          <CenterButton callback={flyToUser} />
          <SearchNewButton callback={updateMarkers} />
        </View>
      )}

      <MapLibreGL.MapView
        compassViewPosition={1}
        compassViewMargins={{
          x: themeFromContext.spacing.m,
          y: themeFromContext.spacing.xl,
        }}
        styleURL={mapStyleURL}
        ref={(c) => {
          if (c !== null) MapRef = c;
        }}
        attributionEnabled={true}
        onRegionDidChange={(e) => {
          setIsCentered(false);
        }}
        style={styles.map}
        logoEnabled={false}
      >
        <MapLibreGL.UserLocation
          ref={(c) => (UserLocationRef = c)}
          visible={true}
          onUpdate={onUserLocationUpdate}
          showsUserHeadingIndicator={true}
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
  iconSize: 0.06,
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
    margin: theme.spacing.l,
    marginRight: theme.spacing.m,
  },

  actionsContainer: {
    flexDirection: "row",
    position: "absolute",
    zIndex: 9998,
    justifyContent: "center",
    gap: 24,
    alignItems: "center",
    bottom: theme.spacing.l,
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
