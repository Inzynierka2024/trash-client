import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useAuth } from "../../Logic/AuthContext";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import stats_icon from "../../../../assets/profile/user-stats.png";
import collected_trash_icon from "../../../../assets/profile/statistics.png";
import logout_icon from "../../../../assets/profile/logout.png";
import ll_icon from "../../../../assets/litter-looter/adaptive.png";
import guilds_icon from "../../../../assets/guilds.png";
import settings_icon from "../../../../assets/settings.png";
import user_profile_icon from "../../../../assets/profile/profile-data.png";
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";
import pointsIcon from "../../../../assets/profile/coin.png";
import rankingIcon from "../../../../assets/trophy.png";
import get_all_scoreboard from "../../Logic/API/get_all_scoreboard";
import get_user_data from "../../Logic/API/get_user_data";

interface ProfileFormProps {
  navigateTo: (screen: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = () => {

  const { state } = useAuth();
  const themeFromContext = useContext(ThemeContext);
  const { logout } = useAuth();
  const navigation = useNavigation < any > ();
  const { getUserLogin } = useAuth();

  const [ranking, setRanking] = useState({
    points: 0,
    rank: 0,
  });

  const [user, setUserData] = useState({
    email: "",
    location: "",
    username: "",
  });

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

  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false,
  );

  const handleLogout = async () => {
    try {
      logout();
      Alert.alert("Zostałeś pomyślnie wylogowany!");
      navigation.navigate("Login");
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const { width, height } = Dimensions.get("window");
  const isPortrait = height > width;
  const buttonWidth = isPortrait ? width * 0.4 : width / 3 - 20; 

  useEffect(() => {
    async function fetchData() {
      if (state.token) {
        const tempUser = await getUser();
        const tempPoints = await getUserPoints();
        console.log(tempPoints);
        setUserData(tempUser);
      }
    }
    fetchData().then(() => {});

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

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <View style={styles.container}>

        <View style={styles.headerContainer}>
          <View style={styles.pointsContainer}>
            <Image source={rankingIcon} style={styles.pointsIcon} />
            <Text style={styles.rank}>{ranking.rank}</Text>
          </View>
          <View style={styles.pointsContainer}>
            <Image source={pointsIcon} style={styles.pointsIcon} />
            <Text style={styles.rank}>{ranking.points}</Text>
          </View>
        </View>

        <Image source={ll_icon} style={styles.userIcon} />
        <Text
          style={{
            ...styles.loginText,
            color: themeFromContext.colors.primaryText,
          }}
        >
          {user.username}
        </Text>
        <View style={styles.buttonGrid}>
          <TouchableOpacity
            style={[styles.button, { width: buttonWidth }]}
            onPress={() => navigation.navigate("ProfileStats")}
          >
            <Image source={user_profile_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Dane użytkownika</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { width: buttonWidth }]}
            onPress={() => navigation.navigate("ProfileGarbageStats")}
          >
            <Image source={stats_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Statystyka użytkownika</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { width: buttonWidth }]}
            onPress={() => navigation.navigate("GarbageStatistics")}
          >
            <Image source={collected_trash_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Statystyka odpadów</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { width: buttonWidth }]}
            onPress={handleLogout}
          >
            <Image source={logout_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Wyloguj</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.colors.primaryText
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: theme.colors.background,
  },
  buttonContainer: {
    marginBottom: 10,
    width: "80%",
    borderRadius: 5,
    overflow: "hidden",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    backgroundColor: theme.colors.green,
    padding: 10,
    margin: 2,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
  },
  rank: {
    fontWeight: 'bold',
    padding:5
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonIcon: {
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pointsContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  pointsIcon: {
    width: 30,
    height: 30,
    marginLeft: 5,
    resizeMode: "contain",
  },
  pointsText: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 16,
    color: theme.colors.primaryText,
  },
});

export default ProfileForm;
