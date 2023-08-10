import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../Logic/AuthContext';

const ProfileForm: React.FC = () => {
  const { logout } = useAuth();
  return (
    <View>
      <Text>Your Profile</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default ProfileForm;