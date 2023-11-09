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
import { TrashModal } from "./TrashModal/TrashModal";
import get_trash_in_area from "../../Logic/API/get_trash_in_area";
import { AddNewButton } from "./Buttons/AddNew";
import { CenterButton } from "./Buttons/CenterButton";
import { SearchNewButton } from "./Buttons/SearchNew";
import { BinTypes } from "../../Models/BinTypes";
import get_bins_in_area from "../../Logic/API/get_bins_in_area";
import { BinForm } from "../New/BinForm";
import { ElementMapMarkers } from "../../Models/ElementMapMarkers";
import { ElementTypes } from "../../Models/ElementTypes";

export interface MarkerData {
  id: number;
  latitude: number;
  longitude: number;
  type?: BinTypes;
}

export const MapComponent = () => {
  const themeFromContext = useContext(ThemeContext);

  const MAPTILER_API_KEY = "vX05uJQEE4mrjJmQSrG4";

  const [userState, setUserState] = useState<MapLibreGL.Location>({
    coords: { latitude: 0, longitude: 0 },
  });

  // Trash markers
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  // Bin markers
  const binMarkers = {
    general: useState<MarkerData[]>([]),
    bio: useState<MarkerData[]>([]),
    plastic: useState<MarkerData[]>([]),
    paper: useState<MarkerData[]>([]),
    glass: useState<MarkerData[]>([]),
    "e-waste": useState<MarkerData[]>([]),
    pszok: useState<MarkerData[]>([]),
    debris: useState<MarkerData[]>([]),
    cloth: useState<MarkerData[]>([]),
  };

  const [isCentered, setIsCentered] = useState(true);

  function onUserLocationUpdate(location: MapLibreGL.Location) {
    setUserState(location);
  }

  function flyToUser() {
    if (!userState.coords || !CameraRef) return;

    CameraRef.flyTo(
      [userState.coords.latitude, userState.coords.longitude],
      500,
    );

    triggerUpdate("camera");
    setIsCentered(true);
  }

  const [newTrashModalVisible, setNewTrashModalVisible] = useState(false);
  const [newBinModalVisible, setNewBinModalVisible] = useState(false);

  const [newBinType, setNewBinType] = useState<BinTypes>("general");

  function addNewTrash() {
    setNewTrashModalVisible(true);
  }

  function addNewBin(type: BinTypes) {
    setNewBinType(type);
    setNewBinModalVisible(true);
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
      console.error("Invalid garbage points");
      return [];
    }
  }

  async function fetchNewBins() {
    if (MapRef === null) return;
    const bounds = await MapRef.getVisibleBounds();

    const result = await get_bins_in_area(bounds);

    if (result.isOk) {
      const points = result.data["map_points"];
      return points;
    } else {
      console.error("Invalid bin points");
      return [];
    }
  }

  async function updateMarkers() {
    const markers = await fetchNewMapMarkers();
    setMarkers(markers);
    updateMapPoints();
  }

  function groupBinMarkers(markers: MarkerData[]) {
    for (const marker of markers) {
      const type = marker.type ?? "general";
      const [binCollection, setBinCollection] = binMarkers[type];
      const newBinCollection = [...binCollection, marker];
      setBinCollection(newBinCollection);
    }
  }

  async function updateBinMarkers() {
    const markers = await fetchNewBins();
    groupBinMarkers(markers);
    updateMapPoints();
  }

  useEffect(() => {
    // Startup intervals
    let markerInv;

    (async () => {
      // Load markers one second after map load
      setTimeout(async () => {
        await updateMarkers();
        await updateBinMarkers();
      }, 1000);

      // Fetch new markers every minute
      markerInv = setInterval(async () => {
        await updateMarkers();
        await updateBinMarkers();
      }, 60000);
    })();

    // Clean up interval
    return () => {
      clearInterval(markerInv);
    };
  }, []);

  // This updates points on a map
  async function updateMapPoints() {
    setTrashCollection({
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

    for (const key in binCollections) {
      const [_binCollection, setBinCollection] = binCollections[key];

      setBinCollection({
        type: "FeatureCollection",
        features: binMarkers[key][0].map((marker) => {
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
  }

  const binCollections = {
    general: useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
    bio: useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
    plastic: useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
    paper: useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
    glass: useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
    "e-waste": useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
    pszok: useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
    debris: useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
    cloth: useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    }),
  };

  const [trashCollection, setTrashCollection] =
    useState<GeoJSON.FeatureCollection>({
      type: "FeatureCollection",
      features: [],
    });

  const [currentMarker, setCurrentMarker] = useState<MarkerData>(null);
  const [trashModalVisible, setTrashModalVisible] = useState(false);

  const [currentBin, setCurrentBin] = useState<MarkerData>(null);
  const [binModalVisible, setBinModalVisible] = useState(false);

  async function showTrashData(id: number) {
    const marker = markers.find((e) => e["id"] == id);

    setCurrentMarker(marker);
    setTrashModalVisible(true);
  }

  async function showBinData(id: number) {
    let bin = undefined;
    for (const key in binMarkers) {
      const [binCollection, _setBinCollection] = binMarkers[key];
      bin = binCollection.find((e) => e["id"] == id);
      if (bin) break;
    }
    setCurrentBin(bin);
    setBinModalVisible(true);
  }

  function onTrashPinPress(event: any) {
    const id = event["features"][0]["id"];
    showTrashData(id);
  }

  function onBinPinPress(event: any) {
    const id = event["features"][0]["id"];
    showBinData(id);
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
        visible={newTrashModalVisible}
        onRequestClose={() => {
          setNewTrashModalVisible(false);
        }}
      >
        <TrashForm
          location={userState}
          setModal={setNewTrashModalVisible}
          updateMap={updateMarkers}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={newBinModalVisible}
        onRequestClose={() => {
          setNewBinModalVisible(false);
        }}
        style={{ backgroundColor: "transparent" }}
      >
        <BinForm
          location={userState}
          type={newBinType}
          setModal={setNewBinModalVisible}
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
        <AddNewButton newTrash={addNewTrash} newCan={addNewBin} />
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
          shape={trashCollection}
          onPress={onTrashPinPress}
        >
          <MapLibreGL.SymbolLayer
            id="pinsLayer"
            style={pinLayerStyles.garbage}
          />
        </MapLibreGL.ShapeSource>

        {Object.keys(binCollections).map((key) => {
          const [binCollection, _setBinCollection] = binCollections[key];

          return (
            <MapLibreGL.ShapeSource
              id={`${key}PinsSource`}
              shape={binCollection}
              onPress={onBinPinPress}
            >
              <MapLibreGL.SymbolLayer
                id={`${key}PinsLayer`}
                style={pinLayerStyles[key]}
              />
            </MapLibreGL.ShapeSource>
          );
        })}
      </MapLibreGL.MapView>
    </View>
  );
};

const commonPinLayerStyle: StyleProp<SymbolLayerStyle> = {
  iconAllowOverlap: true,
  iconAnchor: "bottom",
  iconSize: 0.06,
};

const pinLayerStyles: { [key in ElementTypes]: StyleProp<SymbolLayerStyle> } = {
  general: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.general,
  },
  bio: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.bio,
  },
  plastic: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.plastic,
  },
  paper: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.paper,
  },
  glass: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.glass,
  },
  "e-waste": {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers["e-waste"],
  },
  pszok: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.pszok,
  },
  debris: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.debris,
  },
  cloth: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.cloth,
  },
  garbage: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.garbage,
  },
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
