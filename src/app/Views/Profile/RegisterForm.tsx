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
  const { login } = useAuth();
  const navigation = useNavigation();

  const SIGNUP_URL = `http://${get_api_url()}/signup`;
  const LOGIN_URL = `http://${get_api_url()}/login`;

  const handleRegister = async () => {
    try {
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
function storeToken(token: any) {
  throw new Error("Function not implemented.");
}

function storeUserData(userData: any) {
  throw new Error("Function not implemented.");
}

