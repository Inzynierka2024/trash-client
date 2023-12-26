import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Icon } from "react-native-elements";
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../Logic/AuthContext";
import get_user_data from "../../Logic/API/get_user_data";
import gmailIcon from "../../../../assets/profile/gmail.png";
import locationIcon from "../../../../assets/profile/home.png";
import passwordIcon from "../../../../assets/profile/password.png";
import profileIcon from "../../../../assets/profile/profile.png";
import pointsIcon from "../../../../assets/profile/coin.png";
import { useIsFocused } from "@react-navigation/native";
import get_user_bins from "../../Logic/API/get_user_bins";
import calculate_distance from "../../Utils/calculate_distance";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { UserTrashMetadata } from "../../Models/UserTrashMetadata";
import get_user_garbage from "../../Logic/API/get_user_garbage";
import get_garbage_metadata from "../../Utils/get_garbage_metadata";
import { FlatList } from "react-native-gesture-handler";

const initialLayout = { width: Dimensions.get("window").width };

export const ProfileStatsForm = () => {
  const { state } = useAuth();

  const [userState, setUserState] = useState < MapLibreGL.Location > ({
    coords: { latitude: 0, longitude: 0 },
  });
  const [collectedData, setCollectedData] = useState < UserTrashMetadata[] > ([]);
  const [reportedData, setReportedData] = useState < UserTrashMetadata[] > ([]);

  const [user, setUserData] = useState({
    email: "",
    location: "",
    username: "",
    points: 0,
  });

  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false,
  );
  const themeFromContext = useContext(ThemeContext);
  const navigation = useNavigation();

  const navigateToEditForm = () => {
    navigation.navigate("ProfileEdit");
  };

  const TimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
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
    async function fetchData() {
      if (state.token) {
        const tempUser = await getUser();
        const tempGarbage = await getGarbage();
        setUserData(tempUser);
        const collectedParsed = tempGarbage.data.collected.map(item => get_garbage_metadata(item));
        setReportedData(tempGarbage.data.added as UserTrashMetadata[]);
        setCollectedData(tempGarbage.data.collected as UserTrashMetadata[]);

      }
    }
    fetchData();
  }, [state.token]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchDataOnFocus() {
      if (isFocused) {
        const tempUser = await getUser();
        const bins = await getBins();
        const garbage = await getGarbage();
        setUserData(tempUser);
      }
    }
    fetchDataOnFocus();
  }, [isFocused]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "collected", title: "Zebrane Odpady" },
    { key: "reported", title: "Zgłoszone Odpady" },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.tile}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${item.picture}` }}
        style={{ width: 100, height: 100, borderRadius: 10 }}
      />
      <View style={styles.tileRow}>
        <Text style={styles.tileText}>Zgłoszono: {item.creation_username}</Text>
        <Text style={styles.tileText}>{TimestampToDate(item.creation_timestamp)}</Text>

      </View>
      <View style={styles.tileRow}>
      <Text style={styles.tileText}>Zebrano: {item.collection_username}</Text>
        <Text style={styles.tileText}>{TimestampToDate(item.collection_timestamp)}</Text>
      </View>
    </View>
  );
  
  const CollectedTab = () => (
    <FlatList
      data={collectedData}
      renderItem={renderItem}
      keyExtractor={(item) => item.garbage_id.toString()}
    />
  );

  const ReportedTab = () => (
    <FlatList
      data={reportedData}
      renderItem={renderItem}
      keyExtractor={(item) => item.garbage_id.toString()}
    />
  );

  const renderScene = SceneMap({
    collected: CollectedTab,
    reported: ReportedTab,
  });
  const distance = calculate_distance(
    userState.coords.latitude,
    userState.coords.longitude,
    0,
    0,
  );


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
      color: themeFromContext.colors.primaryText,
    },
    editIcon: {
      position: "absolute",
      marginTop: 10,
      top: 10,
      right: 16,
      zIndex: 10,
      padding: 8,
      backgroundColor: themeFromContext.colors.background,
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
      borderBottomColor: themeFromContext.colors.background,
      paddingBottom: 4,
      fontWeight: "normal",
      marginLeft: 10,
      color: themeFromContext.colors.primaryText,
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
      color: themeFromContext.colors.primaryText,
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
      backgroundColor: themeFromContext.colors.background,
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
      color: themeFromContext.colors.primaryText,
      flex: 1, 
      marginHorizontal: 2, 
    },
    tileTextBold: {
      color: themeFromContext.colors.primaryText,
      flex: 1, 
      marginHorizontal: 2, 
      fontStyle: 'bold',
    },
  });

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.editIcon} onPress={navigateToEditForm}>
          <Icon name="edit" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>

          <View style={styles.pointsContainer}>
            <Image source={pointsIcon} style={styles.pointsIcon} />
            <Text style={styles.pointsText}>{user.points}</Text>
          </View>
        </View>

        <View style={styles.element}>
          <Image source={profileIcon} style={styles.icon} />
          <Text style={[styles.readOnly, styles.textCentered]}>
            {" "}
            {user.username}
          </Text>
        </View>

        <View style={styles.element}>
          <Image source={gmailIcon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.readOnly}> {user.email}</Text>
        </View>

        <View style={styles.element}>
          <Image source={passwordIcon} style={styles.icon} />
          <Text style={styles.readOnly}>***</Text>
        </View>

        <View style={styles.element}>
          <Image source={locationIcon} style={styles.icon} />
          <Text style={styles.readOnly}>{user.location}</Text>
        </View>
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
      </View>
    </ThemeContext.Provider>
  );
};

export default ProfileStatsForm;
