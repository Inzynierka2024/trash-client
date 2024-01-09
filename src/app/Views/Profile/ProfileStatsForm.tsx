import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
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
import rankingIcon from "../../../../assets/trophy.png";
import { useIsFocused } from "@react-navigation/native";
import get_all_scoreboard from "../../Logic/API/get_all_scoreboard";
import { Loading } from "../../Utils/Loading";
import ll_icon from "../../../../assets/litter-looter/adaptive.png";

const initialLayout = { width: Dimensions.get("window").width };

export const ProfileStatsForm = () => {
  const [loading, setLoading] = useState(false);
  const { state } = useAuth();
  const [randomStars, setRandomStars] = useState('');
  const [user, setUserData] = useState({
    email: "",
    location: "",
    username: "",
  });

  const [ranking, setRanking] = useState({
    points: 0,
    rank: 0,
  });

  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false,
  );
  const themeFromContext = useContext(ThemeContext);
  const textColor = themeFromContext.colors.primaryText;
  const secondaryText = themeFromContext.colors.secondaryText;
  const background = themeFromContext.colors.background;

  const navigation = useNavigation();

  const navigateToEditForm = () => {
    navigation.navigate("ProfileEdit");
  };

  const generateRandomStars = () => {
    const length = Math.floor(Math.random() * 5) + 6;
    return '*'.repeat(length);
  };

  useEffect(() => {
    setRandomStars(generateRandomStars());
  }, []);

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

  async function getUserPoints() {
    const result = await get_all_scoreboard();
    if (result.isOk) {
      setRanking({
        points: result.data[0].points,
        rank: result.data[0].rank,
      });
    } else {
      console.error("Invalid points");
    }
  }

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (state.token) {
        const tempUser = await getUser();
        const tempPoints = await getUserPoints();
        console.log(tempPoints);
        setUserData(tempUser);
      }
    }
    fetchData().then(() => { setLoading(false); });

  }, [state.token]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchDataOnFocus() {
      if (isFocused) {
        const tempUser = await getUser();
        const tempPoints = await getUserPoints();
        setUserData(tempUser);
      }
    }
    fetchDataOnFocus();
  }, [isFocused]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    element: {
      flexDirection: 'row',
      padding: 10,
      margin: 2,
      alignItems: 'center',
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
      flex: 1,
      marginLeft: 10,
      color: textColor,
      fontWeight: 'bold',
      fontSize: 16, // Ensure this matches the text size in ProfileEditForm
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
      marginBottom: 20,
      backgroundColor: '#fff'
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
      justifyContent: "center",
      marginLeft: 40,
      resizeMode: "contain",
    },
    pointsText: {
      marginTop: 5,
      marginLeft: 5,
      fontSize: 16,
      color: textColor,
      fontWeight: 'bold',
    },
    icon: {
      width: 48,
      height: 48,
      resizeMode: 'contain',
      marginLeft: 10,
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
      fontWeight: 'bold',
    },
    tileText: {
      color: textColor,
      flex: 1,
      marginHorizontal: 2,
      fontWeight: 'bold',
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

      <View style={styles.container}>
        <Image source={ll_icon} style={styles.userIcon} />

        <TouchableOpacity style={styles.editIcon} onPress={navigateToEditForm}>
          <Icon name="edit" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.element}>
          <View style={styles.headerContainer}>
            <View style={styles.pointsContainer}>
              <Image source={rankingIcon} style={styles.pointsIcon} />
              <Text style={styles.readOnly}>{ranking.rank}</Text>
            </View>
            <View style={styles.pointsContainer}>
              <Image source={pointsIcon} style={styles.pointsIcon} />
              <Text style={styles.readOnly}>{ranking.points}</Text>
            </View>
          </View>
        </View>

        <View style={styles.element}>
          <Image source={profileIcon} style={styles.icon} />
          <Text style={[styles.readOnly, styles.textCentered]}>
            {user.username}
          </Text>
        </View>

        <View style={styles.element}>
          <Image source={gmailIcon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.readOnly}> {user.email}</Text>
        </View>

        <View style={styles.element}>
          <Image source={passwordIcon} style={styles.icon} />
          <Text style={styles.readOnly}>{randomStars}</Text>
        </View>

      </View>

    </ThemeContext.Provider>
  );
};

export default ProfileStatsForm;
