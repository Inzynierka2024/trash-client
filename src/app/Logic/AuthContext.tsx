import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
}

interface AuthContextProps {
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
  register: (token: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [state, setState] = useState<AuthState>({ token: null, isLoggedIn: false });

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      if (token) {
        setState({ token, isLoggedIn: true });
      }
    };
    fetchToken();
  }, []);

  const login = async (token: string, userData) => {
    await AsyncStorage.setItem('jwtToken', token);
    setState({ token, isLoggedIn: true });
    //storeUserData(userData);
    storeToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    setState({ token: null, isLoggedIn: false });
    
  };

  const register = (token: string, userData) => {
    login(token, userData);  
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
