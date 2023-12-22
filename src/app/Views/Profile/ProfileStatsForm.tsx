import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  useColorScheme,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Icon } from "react-native-elements";
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../Logic/AuthContext";
import get_user_data from "../../Logic/API/get_user_data";
import ll_icon from "../../../../assets/litter-looter/adaptive.png";
import gmailIcon from "../../../../assets/profile/gmail.png";
import locationIcon from "../../../../assets/profile/home.png";
import passwordIcon from "../../../../assets/profile/password.png";
import profileIcon from "../../../../assets/profile/profile.png";
import pointsIcon from "../../../../assets/profile/coin.png";
import { useIsFocused } from "@react-navigation/native";
import get_user_bins from "../../Logic/API/get_user_bins";
import { BinMetadata } from "../../Models/BinMetadata";
import { ElementCard } from "../Card/ElementCard";
import calculate_distance from "../../Utils/calculate_distance";
import MapLibreGL from "@maplibre/maplibre-react-native";
import { UserTrashMetadata } from "../../Models/UserTrashMetadata";
import get_user_garbage from "../../Logic/API/get_user_garbage";
import get_garbage_metadata from "../../Utils/get_garbage_metadata";

const initialLayout = { width: Dimensions.get("window").width };

const Tile = ({ data }) => (
  <View style={styles.tile}>
    <Image source={{ uri: "data:image/jpg;base64," + data.picture }} style={styles.tileImage} />
    <View style={styles.tileContent}>
      <Text style={styles.tileText}>Zebrano: {data.collection_timestamp}</Text>
      <Text style={styles.tileText}>Lokacja: {data.latitude} {data.longitude}</Text>
    </View>
  </View>
);

// const Tile = ({ data }) => (
//   <View style={styles.tile}>
//     <Text style={styles.tileText}>ID: {data.Id}</Text>
//     <Text style={styles.tileText}>Collected By: {data.CollectionUsername}</Text>
//     <Text style={styles.tileText}>Collected On: {data.CollectionTimestamp?.toDateString()}</Text>
//     <Text style={styles.tileText}>Location: {data.Latitude}, {data.Longitude}</Text>
//   </View>
// );

const renderCollectedItem = (item: UserTrashMetadata[], index: React.Key) => {
  console.log("item: ", item);
  return (
    <Tile key={index} data={item} />
  );
};

const CollectedTrashTab = ({ collected }) => {
  console.log("collected: ", collected);
  return (
    <ScrollView>
      {collected.map((item, index) => (
        <Tile key={index} data={item} />
      ))}
    </ScrollView>
  );
};




const ReportedTrashTab = ({ reported }) => {
  // if (!reported) {
  //   return <Text>Loading...</Text>;
  // }
  // return (
  //   <ScrollView style={styles.tabScene}>
  //     {reported.map((item, index) => (
  //       <Tile key={index} data={item} />
  //     ))}
  //   </ScrollView>);
}

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
  const navigation = useNavigation < any > ();

  const navigateToEditForm = () => {
    navigation.navigate("ProfileEdit");
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
        //setReportedData(tempGarbage.data.added);
        setCollectedData(collectedParsed);
        //console.log("collected: ", collectedData);
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

  const distance = calculate_distance(
    userState.coords.latitude,
    userState.coords.longitude,
    0,
    0,
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'collected':
        return <CollectedTrashTab collected={collectedData} />;
      case 'reported':
      // return <ReportedTrashTab reported={reportedData} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: themeFromContext.colors.green }}
      style={{ backgroundColor: themeFromContext.colors.green }}
      labelStyle={{ color: themeFromContext.colors.primaryText }}
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    element: {
      flexDirection: "row",
      padding: 10,
      margin: 2,
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
      alignSelf: "center", // Center the text vertically within its parent
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
      borderBottomWidth: 1,
      borderBottomColor: "#CCCCCC",
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
      alignItems: "flex-start", // Align items to the start of the container
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
    },
    tabScene: {
      flex: 1,
    },
    tile: {
      height: 100, // Adjust height as needed
      backgroundColor: "#e0e0e0", // Example background color
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 5,
      marginHorizontal: 10,
    },
    tileText: {
      color: "black", // Adjust text color as needed
    },
  });

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <ScrollView style={styles.container}>
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

        <ScrollView style={{
          ...styles.tabView,
          backgroundColor: themeFromContext.colors.contrastOverlay,
        }}>
          <CollectedTrashTab collected={collectedData} />
        </ScrollView>

        {/* <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
          style={{
            ...styles.tabView,
            backgroundColor: themeFromContext.colors.background,
          }}
        /> */}

        {/* <View>
          {collectedData !== null && (
            <ElementCard
              type={collectedData.Type}
              timestamp={collectedData.CreationTimestamp}
              addedBy={collectedData.Username}
              binStatus={collectedData.Status}
              distance={distance}
              imageEnabled={false}
            />
          )}
        </View> */}
        {/* <StickyTabView/> */}
      </ScrollView>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  tabView: {
    flex: 1,
    width: "100%",
    marginTop: 5,
  },
  tabScene: {
    flex: 1,
  },
  tile: {
    flexDirection: 'row', // Arrange image and content side by side
    alignItems: 'center', // Center items vertically
    //backgroundColor: '#fc4', // White background for the tile
    borderRadius: 5, // Rounded corners for the tile
    padding: 10, // Padding inside the tile
    marginVertical: 8, // Margin between tiles
    marginHorizontal: 16, // Horizontal margin
    elevation: 2, // Shadow for the tile
    //width: 50,
    //height: 50
  },
  tileImage: {
    width: 80, // Width of the image
    height: 80, // Height of the image
    borderRadius: 5, // Rounded corners for the image
    marginRight: 10, // Margin between image and text content
  },
  tileContent: {
    flex: 1, // Take up remaining space
  },
  tileText: {
    fontSize: 16, // Font size for the text
    //color: '#333', // Color for the text
    marginBottom: 4, // Margin between text elements
  },
});
export default ProfileStatsForm;
