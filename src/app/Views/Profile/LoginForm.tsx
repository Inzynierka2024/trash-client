import React, { useState, useRef, useContext } from "react";
import {
  Animated,
  Alert,
  Button,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useAuth } from "../../Logic/AuthContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import get_api_url from "../../Utils/get_api_url";
import logo from "../../../../assets/litter-looter-high-resolution-logo-color-on-transparent-background.png";
import { join } from "path";
import { ThemeContext, darkTheme, palette, theme } from "../../../theme/theme";

const { width: screenWidth } = Dimensions.get("window");

const LoginForm: React.FC = () => {
  const [darkMode, _setDarkMode] = useState(
    useColorScheme() === "dark" ? true : false,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation<any>();
  const themeFromContext = useContext(ThemeContext);

  const animatePress = useRef(new Animated.Value(1)).current;

  const handleLogin = async () => {
    try {
      const base = await get_api_url();
      const URL = join(base, `user/login`);
      const response = await axios.post(URL, {
        email: email.toLowerCase(),
        password,
      });

      console.log(response);

      switch (response.status) {
        case 200:
          if (response.data.token) {
            login(response.data.token);
            navigation.navigate("Profile");
          } else {
            throw new Error("Token: Token not found in response.");
          }
          break;
        default:
          console.log(response.status + ": " + response.data.message);
          Alert.alert("Błąd", "Wystąpił błąd podczas logowania", [], {
            cancelable: true,
          });
      }
    } catch (error) {
      console.log(error);

      Alert.alert("Błąd", "Wystąpił błąd podczas logowania", [], {
        cancelable: true,
      });
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
    }).start(handleLogin);
  };

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <TextInput
          style={{
            ...styles.input,
            color: themeFromContext.colors.primaryText,
          }}
          placeholder="Email"
          placeholderTextColor={themeFromContext.colors.secondaryText}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={{
            ...styles.input,
            color: themeFromContext.colors.primaryText,
          }}
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
            <Animated.Text style={styles.buttonText}>Login</Animated.Text>
          </TouchableOpacity>
        </Animated.View>
        <Text
          style={{
            ...styles.text,
            color: themeFromContext.colors.secondaryText,
          }}
        >
          Jeszcze nie masz konta?{" "}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.text, styles.link]}>Zarejestruj się tutaj</Text>
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
    backgroundColor: "#3d9970",
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
    fontFamily: "reem-kufi-regular",
  },
  link: {
    color: "blue",
  },
});

export default LoginForm;
