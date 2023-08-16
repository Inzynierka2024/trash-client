import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import { useAuth } from '../../Logic/AuthContext';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';

interface ProfileFormProps {
    navigateTo: (screen: string) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ navigateTo }) => {
  const { logout } = useAuth();
  const navigation = useNavigation();
  const {getUserLogin} = useAuth();
  
  const handleLogout = async () => {
    try{
        logout();
        Alert.alert("You were successfully logged out");
        navigation.navigate("Login");
    }
    catch(e){
      throw new Error(e.message);
    }
  };
  const [userLogin, setUserLogin] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserLogin = async () => {
      try{
      const login = await getUserLogin();
      setUserLogin(login);
      }
      catch(e)
      {
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
            <CustomButton title="User Stats" onPress={() => navigateTo('UserStats')} />
            <CustomButton title="Collected Trash" onPress={() => navigateTo('UserCollectedTrash')} />
            <CustomButton title="User Info" onPress={() => navigateTo('UserInfo')} />
            <CustomButton title="Settings" onPress={() => navigateTo('Settings')} />
            <CustomButton title="Logout" onPress={handleLogout} />
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
});

export default ProfileForm;
