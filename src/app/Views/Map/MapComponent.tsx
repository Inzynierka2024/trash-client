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
import get_heatmap_data from "../../Logic/API/get_heatmap_data";
import { ToggleHeatmapButton } from "./Buttons/ToggleHeatmapButton";
import { HeatmapControls } from "./Heatmap/HeatmapControls";

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

  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const [heatmapData, setHeatmapData] = useState<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    if (heatmapOpen) fetchHeatmapData();
    else fetchAndShowPoints();
  }, [heatmapOpen]);

  const [heatmapPeriod, _setHeatmapPeriod] = useState<[Date, Date] | null>(
    null,
  );

  const setHeatmapPeriod = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    console.log("Setting heatmap period", firstDay, lastDay);

    _setHeatmapPeriod([firstDay, lastDay]);
  };

  const moveHeatmapPeriod = (months: number) => {
    const newDate = new Date(heatmapPeriod[0]);
    newDate.setMonth(newDate.getMonth() + months);
    setHeatmapPeriod(newDate);
  };

  useEffect(() => {
    if (heatmapOpen) fetchHeatmapData();
  }, [heatmapPeriod]);

  function toggleHeatmap() {
    setHeatmapOpen(!heatmapOpen);
  }

  function fetchHeatmapData() {
    if (!heatmapOpen) return;
    if (heatmapPeriod === null) return;
    if (MapRef == null) return;

    const begdate = heatmapPeriod[0].toISOString();
    const enddate = heatmapPeriod[1].toISOString();

    MapRef.getVisibleBounds().then((bounds) => {
      get_heatmap_data(bounds, begdate, enddate).then((result) => {
        if (result.isOk) {
          const points = result.data["map_points"];

          setHeatmapData({
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
    });
  }

  // Trash markers
  const [garbageMarkers, setGarbageMarkers] = useState<MarkerData[]>([]);

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

  function setBinMarkers(markers: any) {
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
    // debris: false,
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

    setTimeout(() => {
      fetchAndShowPoints();
    }, 500);
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
    let heatmapInv;

    setHeatmapPeriod(new Date());

    (async () => {
      // Load markers one second after map load
      setTimeout(async () => {
        fetchAndShowPoints();
      }, 1000);

      // Fetch new markers every minute
      markerInv = setInterval(() => {
        fetchAndShowPoints();
      }, 15000);

      // Fetch new heatmap data every 5 minutes
      heatmapInv = setInterval(() => {
        fetchHeatmapData();
      }, 300000);
    })();

    // Clean up interval
    return () => {
      clearInterval(markerInv);
      clearInterval(heatmapInv);
    };
  }, []);

  function fetchAndShowPoints() {
    if (heatmapOpen) return;
    if (MapRef == null) return;

    console.log("(Map) Fetching points");
    MapRef.getVisibleBounds().then((bounds) => {
      // Trash
      get_trash_in_area(bounds).then((result) => {
        if (result.isOk) {
          const points = result.data["map_points"];
          setGarbageMarkers(points);

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

          const markers: { [key in BinTypes]: any[] } = {
            general: [],
            bio: [],
            plastic: [],
            paper: [],
            glass: [],
            "e-waste": [],
            pszok: [],
            // debris: [],
            cloth: [],
            battery: [],
          };

          for (const marker of points) {
            markers[marker.type].push(marker);
          }

          for (const key in markers) {
            setBinMarkers(markers);
          }

          for (const key in markers) {
            setBinCollection(key as BinTypes, markers[key]);
          }
        }
      });
    });
  }

  const [binCollections, binClctDispatch] = useReducer(
    binCollectionsReducer,
    initialBinCollections,
  );
  function setBinCollection(type: BinTypes, markers: MarkerData[]) {
    binClctDispatch({
      type: "SET_BIN_COLLECTION",
      payload: {
        type,
        markers,
      },
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
    const marker = garbageMarkers.find((e) => e["id"] == id);

    setCurrentMarker(marker);
    setTrashModalVisible(true);
  }

  function showBinData(id: number) {
    let bin = undefined;
    for (const key in binMarkers) {
      bin = binMarkers[key].find((e) => e["id"] == id);
      if (bin) break;
    }

    if (!bin) return;

    setCurrentBin(bin);
    setBinModalVisible(true);
  }

  function onTrashPinPress(event: any) {
    const isCluster = event["features"][0]["properties"]["cluster"];
    if (isCluster) return;

    const id = event["features"][0]["id"];
    if (id === undefined || id === null) return;

    console.log("Showing ", id);
    showTrashData(id);
  }

  function onBinPinPress(event: any) {
    const isCluster = event["features"][0]["properties"]["cluster"];
    if (isCluster) return;

    const id = event["features"][0]["id"];
    if (id === undefined || id === null) return;

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

      <View style={styles.buttonsContainer}>
        <ViewFilter
          toggleElementVisibility={toggleElementVisibility}
          elementVisibilites={elementVisibility}
        />
        <ToggleHeatmapButton
          toggleHeatmap={toggleHeatmap}
          state={heatmapOpen}
        />
      </View>

      {heatmapOpen && (
        <View style={styles.heatmapActionsContainer}>
          <HeatmapControls
            currentHeatmapPeriod={heatmapPeriod}
            moveHeatmapPeriod={moveHeatmapPeriod}
          />
        </View>
      )}

      <View style={styles.operationContainer}>
        <AddNewButton newTrash={addNewTrash} newCan={addNewBin} />
      </View>

      {!isCentered && (
        <View style={styles.actionsContainer}>
          <CenterButton callback={flyToUser} />
          <SearchNewButton
            callback={() => {
              if (heatmapOpen) fetchHeatmapData();
              else fetchAndShowPoints();
            }}
          />
        </View>
      )}

      <MapLibreGL.MapView
        compassEnabled={true}
        compassViewPosition={0}
        compassViewMargins={{
          x: themeFromContext.spacing.m,
          y: themeFromContext.spacing.l,
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

        {heatmapOpen && (
          <MapLibreGL.ShapeSource id="heatmapSource" shape={heatmapData}>
            <MapLibreGL.HeatmapLayer
              id="heatmapLayer"
              style={{
                heatmapRadius: 50,
                heatmapWeight: 0.5,
                heatmapIntensity: 0.5,
                heatmapColor: [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0,
                  "rgba(29,108,189,0)",
                  0.1,
                  "rgb(96,166,206)",
                  0.3,
                  "rgb(195,218,231)",
                  0.5,
                  "rgb(227,196,178)",
                  0.7,
                  "rgb(211,121,86)",
                  1,
                  "rgb(171,12,31)",
                ],
              }}
            />
          </MapLibreGL.ShapeSource>
        )}
        {!heatmapOpen && (
          <>
            {elementVisibility["garbage"] && (
              <MapLibreGL.ShapeSource
                id="pinsSource"
                shape={trashCollection}
                onPress={onTrashPinPress}
                cluster={true}
                clusterRadius={16}
                clusterMaxZoomLevel={10}
              >
                <MapLibreGL.SymbolLayer
                  id="pinsLayer"
                  style={pinLayerStyles.garbage}
                />
              </MapLibreGL.ShapeSource>
            )}

            {Object.entries(binCollections).map(([key, binCollection]) => {
              if (!elementVisibility[key]) return null;

              return (
                <MapLibreGL.ShapeSource
                  key={key}
                  id={`bin${key}PinsSource`}
                  shape={binCollection}
                  onPress={onBinPinPress}
                  cluster={true}
                  clusterRadius={16}
                  clusterMaxZoomLevel={10}
                >
                  <MapLibreGL.SymbolLayer
                    id={`bin${key}PinsLayer`}
                    style={pinLayerStyles[key]}
                  />
                </MapLibreGL.ShapeSource>
              );
            })}
          </>
        )}
      </MapLibreGL.MapView>
    </View>
  );
};

const commonPinLayerStyle: StyleProp<SymbolLayerStyle> = {
  iconAllowOverlap: true,
  iconAnchor: "bottom",
  iconSize: 0.06, // 767px * 0.06 = 46px
  textField: ["get", "point_count"],
  textAnchor: "center",
  textPadding: 0,
  textOffset: [0, -1.3],
  textColor: "white",
  textFont: ["Open Sans Bold"],
  textSize: 18,
  textHaloColor: "black",
  textHaloWidth: 1,
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
  // debris: {
  //   ...commonPinLayerStyle,
  //   iconImage: ElementMapMarkers.debris,
  // },
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

  buttonsContainer: {
    position: "absolute",
    zIndex: 9999,
    right: 0,
    top: 0,
    marginRight: 18,
    marginTop: 32,
    flexDirection: "column",
    gap: 16,
  },

  operationContainer: {
    position: "absolute",
    zIndex: 9999,
    right: 0,
    bottom: 0,
    margin: theme.spacing.l,
    marginRight: theme.spacing.m,
  },

  heatmapActionsContainer: {
    flexDirection: "row",
    position: "absolute",
    zIndex: 9998,
    justifyContent: "center",
    gap: 24,
    alignItems: "center",
    top: 64,
    width: 192,
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
