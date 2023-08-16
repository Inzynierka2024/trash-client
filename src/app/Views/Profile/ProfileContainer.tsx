import React from 'react';
import LoginForm from './LoginForm';
import ProfileForm from './ProfileForm';
import { useAuth } from '../../Logic/AuthContext';

const ProfileContainer: React.FC = () => {
  const { state } = useAuth();

  return state.isLoggedIn ? <ProfileForm /> : <LoginForm />;
};

export default ProfileContainer;