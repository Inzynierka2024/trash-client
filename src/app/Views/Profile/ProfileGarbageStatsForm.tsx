import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  SafeAreaView, 
  StatusBar,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../Logic/AuthContext";
import get_user_data from "../../Logic/API/get_user_data";
import { useIsFocused } from "@react-navigation/native";
import get_user_bins from "../../Logic/API/get_user_bins";
import calculate_distance from "../../Utils/calculate_distance";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { UserTrashMetadata } from "../../Models/UserTrashMetadata";
import get_user_garbage from "../../Logic/API/get_user_garbage";
import { FlatList } from "react-native-gesture-handler";
import ReportedGarbageModal from "./GarbageModal/ReportedGarbageModal";
import CollectedGarbageModal from "./GarbageModal/CollectedGarbageModal";
import { TimestampToDate } from "./../../Utils/convert_timestamp";
import {formatDistance} from "./../../Utils/format_distance";
import { Loading } from "../../Utils/Loading";

const initialLayout = { width: Dimensions.get("window").width };

export const ProfileGarbageStatsForm = () => {
  const [loading, setLoading] = useState(false);
  const { state } = useAuth();
  const userLocationRef = useRef({ latitude: 0, longitude: 0 });

  function onUserLocationUpdate(location: MapLibreGL.Location) {
    userLocationRef.current = location.coords;
  }

  const [collectedData, setCollectedData] = useState < UserTrashMetadata[] > ([]);
  const [reportedData, setReportedData] = useState < UserTrashMetadata[] > ([]);

  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false,
  );
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const secondaryText = themeFromContext.colors.secondaryText;
  const background = themeFromContext.colors.background;

  const [collectedModalVisible, setCollectedModalVisible] = useState(false);
  const [reportedModalVisible, setReportedModalVisible] = useState(false);
  const [selectedCollectedItem, setSelectedCollectedItem] = useState(null);
  const [selectedReportedItem, setSelectedReportedItem] = useState(null);

  async function getUser() {
    const result = await get_user_data(state.token);
    if (result.isOk) {
      const user = result["data"];
      return user;
    } else {
      console.error("Invalid user");
      return [];
    }
  }

  async function getGarbage() {
    const garbageResult = await get_user_garbage(state.token);
    if (garbageResult.isOk) {
      return garbageResult;
    } else {
      console.error("Invalid garbage");
      return [];
    }
  }

  async function getBins() {
    const result = await get_user_bins(state.token);
    if (result.isOk) {
      const bins = result.data.added;
      return bins;
    } else {
      console.error("Invalid user");
      return [];
    }
  }

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (state.token) {
        const tempUser = await getUser();
        const tempGarbage = await getGarbage();
        setReportedData(tempGarbage.data.added as UserTrashMetadata[]);
        setCollectedData(tempGarbage.data.collected as UserTrashMetadata[]);
      }
    }
    fetchData().then(()=>{setLoading(false);});
  }, [state.token]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchDataOnFocus() {
      if (isFocused) {
        const tempUser = await getUser();
        const tempGarbage = await getGarbage();
        setReportedData(tempGarbage.data.added as UserTrashMetadata[]);
        setCollectedData(tempGarbage.data.collected as UserTrashMetadata[]);
      }
    }
    fetchDataOnFocus();
  }, [isFocused]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "collected", title: "Zebrane Odpady" },
    { key: "reported", title: "Zgłoszone Odpady" },
  ]);

  const renderItemTemplate = (item) => (
    <View style={styles.tile}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.picture}` }}
        style={{ width: 100, height: 100, borderRadius: 10 }}
      />
      {/* <View style={styles.tileRow}> */}
      <Text style={styles.tileTextBold}>
        {
          formatDistance(calculate_distance(
              userLocationRef.current.latitude,
              userLocationRef.current.longitude,
              item.latitude,
              item.longitude))
        }
      </Text>
      <Text style={styles.tileTextBold}>{TimestampToDate(item.creation_timestamp)}</Text>
      {/* </View> */}
    </View>
  );

  const renderReportedItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedReportedItem(item);
      setReportedModalVisible(true);
    }}>
      {renderItemTemplate(item)}
    </TouchableOpacity>
  );

  const renderCollectedItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedCollectedItem(item);
      setCollectedModalVisible(true);
    }}>
      {renderItemTemplate(item)}
    </TouchableOpacity>
  );

  const CollectedTab = () => (
    <FlatList
      data={collectedData}
      renderItem={renderCollectedItem}
      keyExtractor={(item) => item.garbage_id.toString()}
    />
  );

  const ReportedTab = () => (
    <FlatList
      data={reportedData}
      renderItem={renderReportedItem}
      keyExtractor={(item) => item.garbage_id.toString()}
    />
  );

  const renderScene = SceneMap({
    collected: CollectedTab,
    reported: ReportedTab,
  });


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    element: {
      flexDirection: "row",
      padding: 10,
      //margin: 2,
      alignItems: "center",
    },
    emailContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    emailText: {
      marginLeft: 10,
    },

    textCentered: {
      alignSelf: "center",
      color: textColor,
    },
    editIcon: {
      position: "absolute",
      marginTop: 25,
      top: 10,
      right: 16,
      zIndex: 10,
      padding: 8,
      backgroundColor: theme.colors.green,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    readOnly: {
      fontSize: 16,
      marginVertical: 8,
      width: "100%",
      textAlign: "left",
      //borderBottomWidth: 0.5,
      borderBottomColor: background,
      paddingBottom: 4,
      fontWeight: "normal",
      marginLeft: 10,
      color: textColor,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      margin: 10,
      padding: 10
    },
    userIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "#fff",
    },
    pointsContainer: {
      flex: 1,
      paddingTop: 10,
      justifyContent: "flex-start",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    pointsIcon: {
      width: 30,
      height: 30,
      marginLeft: 5,
      resizeMode: "contain",
    },
    pointsText: {
      marginTop: 5,
      marginLeft: 5,
      fontSize: 16,
      color: textColor,
    },
    icon: {
      width: 48,
      height: 48,
      resizeMode: "contain",
      marginLeft: 4,
    },
    tabView: {
      flex: 1,
      width: "100%",
      borderRadius: 15,
      //overflow: 'hidden',
    },
    tabScene: {
      flex: 1,
    },
    tile: {
      backgroundColor: themeFromContext.colors.transparentBackground,
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      marginHorizontal: 10,
      alignItems: 'center',
    },
    tileRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 5,
    },
    tileText: {
      color: textColor,
      flex: 1,
      marginHorizontal: 2,
    },
    tileTextBold: {
      color: textColor,
      flex: 1,
      marginHorizontal: 2,
      fontWeight: 'bold',
    },
  });

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <Loading visible={loading} />
      <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={props => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: 'white' }}
                style={{ backgroundColor: themeFromContext.colors.primary }}
              />
            )}
            style={styles.tabView}
          />

        <CollectedGarbageModal
          visible={collectedModalVisible}
          onClose={() => setCollectedModalVisible(false)}
          item={selectedCollectedItem}
        />

        <ReportedGarbageModal
          visible={reportedModalVisible}
          onClose={() => setReportedModalVisible(false)}
          item={selectedReportedItem}
        />
      {/* </View> */}
</SafeAreaView>
      <MapLibreGL.UserLocation
        ref={(c) => (UserLocationRef = c)}
        visible={true}
        onUpdate={onUserLocationUpdate}
        showsUserHeadingIndicator={true}
      />
    </ThemeContext.Provider>
  );
};

export default ProfileGarbageStatsForm;
