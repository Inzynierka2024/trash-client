import MapLibreGL, { SymbolLayerStyle } from "@maplibre/maplibre-react-native";
import { useContext, useEffect, useReducer, useState } from "react";
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
import { ViewFilter } from "./ViewFilter/ViewFilter";
import { BinModal } from "./BinModal/BinModal";
import binMarkersReducer, {
  initialBinMarkers,
} from "./Reducers/BinMarkersReducer";
import binCollectionsReducer, {
  initialBinCollections,
} from "./Reducers/BinCollectionsReducer";

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
  const [binMarkers, binDispatch] = useReducer(
    binMarkersReducer,
    initialBinMarkers,
  );
  function clearBinMarkers() {
    binDispatch({
      type: "CLEAR_BIN_MARKERS",
    });
  }
  function addBinMarker(marker: MarkerData) {
    binDispatch({
      type: "ADD_BIN_MARKER",
      payload: marker,
    });
  }
  function setBinMarkers(markers: MarkerData[]) {
    binDispatch({
      type: "SET_BIN_MARKERS",
      payload: markers,
    });
  }

  // Markers visibility
  const [elementVisibility, setElementVisibility] = useState<{
    [key in ElementTypes]: boolean;
  }>({
    // Trash
    garbage: true,

    // Bins
    "e-waste": false,
    bio: true,
    cloth: false,
    debris: false,
    general: true,
    glass: true,
    paper: true,
    plastic: true,
    pszok: false,
    battery: false,
  });

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

  useEffect(() => {
    // Startup intervals
    let markerInv;

    (async () => {
      // Load markers one second after map load
      setTimeout(async () => {
        fetchAndShowPoints();
      }, 1000);

      // Fetch new markers every minute
      markerInv = setInterval(async () => {
        fetchAndShowPoints();
      }, 60000);
    })();

    // Clean up interval
    return () => {
      clearInterval(markerInv);
    };
  }, []);

  function fetchAndShowPoints() {
    if (MapRef == null) return;

    console.log("Fetching points");
    MapRef.getVisibleBounds().then((bounds) => {
      // Trash
      get_trash_in_area(bounds).then((result) => {
        if (result.isOk) {
          const points = result.data["map_points"];
          setMarkers(points);

          setTrashCollection({
            type: "FeatureCollection",
            features: points.map((marker) => {
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
      });

      // Bins
      get_bins_in_area(bounds).then((result) => {
        if (result.isOk) {
          const points = result.data["map_points"];
          clearBinMarkers();

          // FIXME: This is a hack to make sure that the bins are rendered
          // ^ Not my words but Copilot's

          const markers: { [key in BinTypes]: any[] } = {
            general: [],
            bio: [],
            plastic: [],
            paper: [],
            glass: [],
            "e-waste": [],
            pszok: [],
            debris: [],
            cloth: [],
            battery: [],
          };

          for (const marker of points) {
            markers[marker.type].push(marker);
          }

          for (const marker of points) {
            addBinMarker(marker);
          }

          for (const key in markers) {
            createBinCollection(key as BinTypes, markers[key]);
          }
        }
      });
    });
  }

  const [binCollections, binClctDispatch] = useReducer(
    binCollectionsReducer,
    initialBinCollections,
  );
  function createBinCollection(type: BinTypes, markers: MarkerData[]) {
    binClctDispatch({
      type: "SET_BIN_COLLECTION",
      payload: {
        type,
        markers,
      },
    });
  }
  function clearBinCollections() {
    binClctDispatch({
      type: "CLEAR_BIN_COLLECTIONS",
    });
  }

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
      bin = binMarkers[key].find((e) => e["id"] == id);
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
    console.log("Showing ", id);
    showBinData(id);
  }

  function closeTrashModal() {
    setCurrentMarker(null);
    setTrashModalVisible(false);
  }

  function closeBinModal() {
    setCurrentBin(null);
    setBinModalVisible(false);
  }

  function toggleElementVisibility(type: ElementTypes) {
    console.log("Toggling", type, elementVisibility);
    const newVisibility = { ...elementVisibility };
    newVisibility[type] = !newVisibility[type];
    setElementVisibility(newVisibility);
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
          updateMap={fetchAndShowPoints}
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
          updateMap={fetchAndShowPoints}
        />
      </Modal>

      <TrashModal
        updateMapMarkers={fetchAndShowPoints}
        currentTrash={currentMarker}
        trashModalVisible={trashModalVisible}
        onClose={closeTrashModal}
        userState={userState}
      />

      <BinModal
        currentBin={currentBin}
        binModalVisible={binModalVisible}
        onClose={closeBinModal}
        userState={userState}
      />

      <View style={styles.filterContainer}>
        <ViewFilter
          toggleElementVisibility={toggleElementVisibility}
          elementVisibilites={elementVisibility}
        />
      </View>

      <View style={styles.operationContainer}>
        <AddNewButton newTrash={addNewTrash} newCan={addNewBin} />
      </View>

      {!isCentered && (
        <View style={styles.actionsContainer}>
          <CenterButton callback={flyToUser} />
          <SearchNewButton callback={fetchAndShowPoints} />
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

        {Object.entries(binCollections).map(([key, binCollection]) => {
          if (!elementVisibility[key]) return null;

          return (
            <MapLibreGL.ShapeSource
              key={key}
              id={`bin${key}PinsSource`}
              shape={binCollection}
              onPress={onBinPinPress}
            >
              <MapLibreGL.SymbolLayer
                id={`bin${key}PinsLayer`}
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
  battery: {
    ...commonPinLayerStyle,
    iconImage: ElementMapMarkers.battery,
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

  filterContainer: {
    position: "absolute",
    zIndex: 9999,
    right: 0,
    top: 0,
    marginRight: 18,
    marginTop: 100,
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
