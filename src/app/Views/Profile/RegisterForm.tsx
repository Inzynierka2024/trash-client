import React, { useState } from "react";
import { Button, TextInput, View, Alert, StyleSheet } from "react-native";
import { useAuth } from "../../Logic/AuthContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import get_api_url from "../../Utils/get_api_url";

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigation = useNavigation();

  const URL = `http://${get_api_url()}/signup`;

  const handleRegister = async () => {
    try {
      // Modify this URL to match your API endpoint
      const response = await axios.post(URL, {
        username,
        email,
        password,
      });

      switch (response.status) {
        case 201:
          // Success
          // TODO: make a login request here and get the token for later
          const token = "";
          register(token);
          navigation.navigate("Profile"); // Navigate to profile after registering

          break;

        case 202:
          // User already exists
          Alert.alert(response.data.message);
          break;

        case 500:
          // Incorrect data
          Alert.alert(response.data.message);
          break;

        default:
          break;
      }
    } catch (error) {
      Alert.alert("Error", error.message || "There was an error registering.");
    }
  };

  return (
    <View style={styles.container}>
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default RegisterForm;
