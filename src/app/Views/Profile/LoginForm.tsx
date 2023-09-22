import React, { useState, useRef } from "react";
import {
  Animated,
  Alert,
  Button,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useAuth } from "../../Logic/AuthContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import get_api_url from "../../Utils/get_api_url";
import logo from "../../../../assets/litter-looter-high-resolution-logo-color-on-transparent-background.png";

const { width: screenWidth } = Dimensions.get("window");

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation();

  const animatePress = useRef(new Animated.Value(1)).current;
  const URL = `http://${get_api_url()}/user/login`;

  const handleLogin = async () => {
    try {
      const response = await axios.post(URL, {
        email,
        password,
      });

      switch (response.status) {
        case 200:
          if (response.data.token) {
            login(response.data.token, response.data);
            navigation.navigate("Profile");
          } else {
            throw new Error("Token: Token not found in response.");
          }
          break;
        default:
          console.log(response.status + ": " + response.data.message);
          Alert.alert(response.data.message);
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        error.message + error || "There was an error logging in."
      );
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
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
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
      <Text style={styles.text}>Don't have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[styles.text, styles.link]}>Register here</Text>
      </TouchableOpacity>
    </View>
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
