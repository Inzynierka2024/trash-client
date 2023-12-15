import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity, Dimensions, useColorScheme } from 'react-native';
import { useAuth } from '../../Logic/AuthContext';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import stats_icon from "../../../../assets/profile/profile-stats.png";
import collected_trash_icon from "../../../../assets/profile/statistics.png";
import logout_icon from "../../../../assets/profile/logout.png";
import ll_icon from "../../../../assets/litter-looter/adaptive.png";
import guilds_icon from "../../../../assets/guilds.png";
import settings_icon from "../../../../assets/settings.png";
import user_profile_icon from "../../../../assets/user-profile.png";
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";


interface ProfileFormProps {
  navigateTo: (screen: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = () => {

  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false
  );
  const themeFromContext = useContext(ThemeContext);

  const { logout } = useAuth();
  const navigation = useNavigation();
  const { getUserLogin } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      Alert.alert("Zostałeś pomyślnie wylogowany!");
      navigation.navigate("Login");
    }
    catch (e) {
      throw new Error(e.message);
    }
  };

  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  // Button width based on orientation: 2 in vertical and 3 in horizontal
  const buttonWidth = isPortrait ? (width * 0.4) : (width / 3) - 20;  // -20 accounts for margins and padding

  const [userLogin, setUserLogin] = useState < any > (null);

  useEffect(() => {
    const fetchUserLogin = async () => {
      try {
        const login = await getUserLogin();
        setUserLogin(login);
      }
      catch (e) {
        console.error(e.message);
      }
    };

    fetchUserLogin();
  }, []); // The empty dependency array means this useEffect runs once when the component mounts


  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <View style={styles.container}>

        <Image
          source={ll_icon}
          style={styles.userIcon}
        />
        <Text style={{ ...styles.loginText, color: themeFromContext.colors.primaryText }}>{userLogin}</Text>
        <View style={styles.buttonGrid}>
          <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => navigation.navigate('ProfileStats')}>
            <Image source={stats_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Statystyki użytkownika</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => navigation.navigate('CollectedTrash')}>
            <Image source={collected_trash_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Heatmapa</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => navigation.navigate("Guilds")}>
            <Image source={guilds_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Gildie</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => navigation.navigate('Settings')}>
            <Image source={settings_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Ustawienia</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={handleLogout}>
            <Image source={logout_icon} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Wyloguj</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,

  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // choose a suitable color
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    backgroundColor: '#fff'
  },
  buttonContainer: {
    marginBottom: 10,
    width: '80%',
    borderRadius: 5,
    overflow: 'hidden', // Keep the rounded corners for the buttons
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3d9970', // Light Dark Green Color
    padding: 10,
    margin: 2,
    borderRadius: 75, // Adjusted for round shape
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150, // Set a fixed height
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center', // Ensure text is centered
  },
  buttonIcon: {
    width: 50,
    color: '#fff',
    height: 50,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ProfileForm;
