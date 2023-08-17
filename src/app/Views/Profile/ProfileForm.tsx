import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '../../Logic/AuthContext';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';

interface ProfileFormProps {
  navigateTo: (screen: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const { getUserLogin } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      Alert.alert("You were successfully logged out");
      navigation.navigate("Login");
    }
    catch (e) {
      throw new Error(e.message);
    }
  };

  const handleEdit = async () => {
    try {
      console.log("edit navigate");
      navigation.navigate("ProfileEdit");
    }
    catch (e) {
      throw new Error(e.message);
    }
  };

  const [userLogin, setUserLogin] = useState < string | null > (null);

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
    <View style={styles.container}>
      <Image
        source={{ uri: 'YOUR_USER_ICON_URI_HERE' }}
        style={styles.userIcon}
      />
      <Text style={styles.loginText}>{userLogin}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserStats')}>
        <Text style={styles.buttonText}>User Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CollectedTrash')}>
        <Text style={styles.buttonText}>Collected trash</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleEdit}>
        <Text style={styles.buttonText}>User Information</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const CustomButton = ({ title, onPress }) => (
  <View style={styles.buttonContainer}>
    <Button
      title={title}
      color="#2BAC82"
      onPress={onPress}
    />
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f4f4f4', // Consider a light gray to contrast the green buttons
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
    backgroundColor: '#1dc'
  },
  buttonContainer: {
    marginBottom: 10,
    width: '80%',
    borderRadius: 5,
    overflow: 'hidden', // Keep the rounded corners for the buttons
  },
  button: {
    backgroundColor: '#3d9970', // Light Dark Green Color
    padding: 10,
    margin:2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default ProfileForm;
