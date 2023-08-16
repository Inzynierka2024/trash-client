import React, { useState } from 'react';
import { Button, TextInput, View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../../Logic/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import get_api_url from '../../Utils/get_api_url';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const URL = `http://${get_api_url()}/login`;

  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      // Modify this URL to match your API endpoint
      const response = await axios.post(URL, {
        email,
        password
      });

      switch (response.status) {
        case 200:
          if (response.data.token) {
            login(response.data.token, response.data);
            navigation.navigate("Profile");
          }
          else
            throw new Error("Token: Token not found in response.");

          break;

        case 500:
          // Incorrect data
          console.log("500: " + response.data.message);
          Alert.alert(response.data.message);
          break;
        case 401:
          // Incorrect data
          console.log("401: " + response.data.message);
          Alert.alert(response.data.message);
          break;
        case 403:
          // Incorrect data
          console.log("403: " + response.data.message);
          Alert.alert(response.data.message);
          break;
      }
    } catch (error) {
      // Handle any errors from the API call, such as wrong credentials
      Alert.alert("Error", error.message || "There was an error logging in.");
    }


  };

  return (
    <View style={styles.container}>
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
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.text}>Don't have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.text, styles.link]}>Register here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  link: {
    color: 'blue',
  },
});

export default LoginForm;


