import React, { useState, useRef } from "react";
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
} from "react-native";
import { useAuth } from "../../Logic/AuthContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import get_api_url from "../../Utils/get_api_url";
import logo from "../../../../assets/litter-looter-high-resolution-logo-color-on-transparent-background.png";

const { width: screenWidth } = Dimensions.get("window");

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation();

  // Animation state
  const animatePress = useRef(new Animated.Value(1)).current;

  const SIGNUP_URL = `http://${get_api_url()}/user/signup`;
  const LOGIN_URL = `http://${get_api_url()}/user/login`;

  const validateEmail = (email) => {
    // Simple email regex
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    try {
      if (!username || !password || !validateEmail(email)) {
        Alert.alert("Empty fields", "Please, fill all the fields");
        return;
      }
      // Modify this URL to match your API endpoint
      const response = await axios.post(SIGNUP_URL, {
        username,
        email,
        password,
      });

      switch (response.status) {
        case 201:
          console.log("successfull registration");
          // Success
          const loginResponse = await axios.post(LOGIN_URL, {
            email,
            password,
          });
          console.log("login attempt");
          if (loginResponse.status === 200) {
            const token = loginResponse.data.token;
            console.log("token: " + token);

            if (!token) {
              throw new Error("Token: Token not found in response.");
            } else {
              login(token, loginResponse.data);

              navigation.navigate("Profile");
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
          console.log("500: " + response.data.message);
          Alert.alert("Data is incorrect");
          break;

        default:
          break;
      }
    } catch (error) {
      console.log("catch: " + error.message);
      Alert.alert("Error", error.message || "There was an error registering.");
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
      ToastAndroid.show("Successfully registered!", ToastAndroid.SHORT);
    });
  };

  const handleEmailEndEditing = () => {
    if (email) {
      if (!validateEmail(email)) {
        Alert.alert("Invalid email", "Please enter a valid email.");
        return;
      }
      ToastAndroid.show("Email verified!", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        onEndEditing={handleEmailEndEditing}
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
          <Animated.Text style={styles.buttonText}>Register</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.text}>Already have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={[styles.text, styles.link]}>Login here</Text>
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
    backgroundColor: "#3d9970", // Light Dark Green Color
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
