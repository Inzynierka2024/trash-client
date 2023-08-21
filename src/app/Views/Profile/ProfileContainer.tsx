import React, { useEffect } from 'react';
import LoginForm from './LoginForm';
import ProfileForm from './ProfileForm';
import { useAuth } from '../../Logic/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProfileContainer: React.FC = () => {
  const { state } = useAuth();
  const navigation = useNavigation();
  useEffect(() => {
    console.log("container: " + state.isLoggedIn);
    if (state.isLoggedIn)
      navigation.navigate("Profile");
    else
      navigation.navigate("Login");
  }, [navigation]);
  return null;
};
export default ProfileContainer;
