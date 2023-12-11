import React, { useState, useRef, useContext } from "react";
import {
  Button,
  TextInput,
  View,
  Alert,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ToastAndroid,
  Text,
  Image,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useAuth } from "../../Logic/AuthContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import get_api_url from "../../Utils/get_api_url";
import logo from "../../../../assets/litter-looter-high-resolution-logo-color-on-transparent-background.png";
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";

const { width: screenWidth } = Dimensions.get("window");

const RegisterForm: React.FC = () => {

  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation();
  const themeFromContext = useContext(ThemeContext);

  // Animation state
  const animatePress = useRef(new Animated.Value(1)).current;

  const validateEmail = (email) => {
    // Simple email regex
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    const base = await get_api_url();
    const SIGNUP_URL = `${base}/user/signup`;

    try {
      if (!username || !password || !validateEmail(email)) {
        Alert.alert("Puste pola", "Proszę wypełnić wszystkie pola");
        return;
      }
      // Modify this URL to match your API endpoint
      const response = await axios.post(SIGNUP_URL, {
        username,
        password,
        email: email.toLowerCase()
      });
      console.log("####" + response.data);

      switch (response.status) {
        case 200:
          console.log("udana rejestracja");
          const LOGIN_URL = `${base}/user/login`;
          // Success
          const loginResponse = await axios.post(LOGIN_URL, {
            password,
            email: email.toLowerCase()
          });

          console.log("próba logowania");
          if (loginResponse.status === 200) {
            const token = loginResponse.data.token;
            console.log("token: " + token);

            if (!token) {
              throw new Error("Token: Token not found in response.");
            } else {
              login(token);
              navigation.navigate("Profile");
              ToastAndroid.show("Pomyślnie zarejestrowano!", ToastAndroid.SHORT);
            }
          }
          break;

        case 202:
          // User already exists
          console.log("202: " + response.data.message);
          Alert.alert(response.data.message);
          break;

        case 500:
          // Incorrect data
          console.log(response.data);
          console.log("500: " + response.data.message);
          Alert.alert("Nieprawidłowe dane");
          break;

        default:
          break;
      }
    } catch (error) {
      console.log("catch: " + error.message);
      console.log("error: " + error.Trace);
      Alert.alert("Błąd", error.message || "Wystąpił błąd podczas rejestracji.");
    }
  };

  const animateIn = () => {
    Animated.timing(animatePress, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = () => {
    Animated.timing(animatePress, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      handleRegister();
    });
  };

  const handleEmailEndEditing = () => {
    if (email) {
      if (!validateEmail(email)) {
        Alert.alert("Nieprawidłowy adres e-mail", "Proszę wprowadzić poprawny adres e-mail.");
        return;
      }
      ToastAndroid.show("E-mail zweryfikowany!", ToastAndroid.SHORT);
    }
  };

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <TextInput
          style={{ ...styles.input, color: themeFromContext.colors.primaryText }}
          placeholder="Nazwa użytkownika"
          placeholderTextColor={themeFromContext.colors.secondaryText}
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={{ ...styles.input, color: themeFromContext.colors.primaryText }}
          placeholder="E-mail"
          placeholderTextColor={themeFromContext.colors.secondaryText}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          onEndEditing={handleEmailEndEditing}
        />
        <TextInput
          style={{ ...styles.input, color: themeFromContext.colors.primaryText }}
          placeholder="Hasło"
          placeholderTextColor={themeFromContext.colors.secondaryText}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />
        <Animated.View style={{ transform: [{ scale: animatePress }] }}>
          <TouchableOpacity
            onPressIn={animateIn}
            onPressOut={animateOut}
            style={styles.button}
          >
            <Animated.Text style={styles.buttonText}>Zarejestruj</Animated.Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={{ ...styles.text, color: themeFromContext.colors.secondaryText }}>Masz już konto? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.text, styles.link]}>Zaloguj się tutaj</Text>
        </TouchableOpacity>
      </View>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: screenWidth - 32,
    height: (screenWidth - 32) * 0.5,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: {
    width: "100%",
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#3d9970", // Jasnozielony kolor
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  link: {
    color: "blue",
  },
});

export default RegisterForm;
