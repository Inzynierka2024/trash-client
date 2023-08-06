import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import get_api_url from '../Utils/get_api_url';
interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
export const API_URL = get_api_url();
const AuthContext = createContext < AuthProps > ({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState < { token: string | null, authenticated: boolean | null } > ({ token: null, authenticated: null });

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            console.log("stored: ", token);
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        }
        loadToken();
    }, []);

    const register = async (email, password) => {
        try {
            return await axios.post(`${API_URL}/users`, { email, password });
        }
        catch (e) {
            return { error: true, msg: (e).response.data.msg };
        }
    }
    const login = async (email, password) => {
        try {
            const result = await axios.post(`${API_URL}/auth`, { email, password });

            console.log("$$$ login result: ", result);

            setAuthState({ token: result.data.token, authenticated: true });
            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await AsyncStorage.setItem(TOKEN_KEY, result.data.token);

            return result;
        }
        catch (e) {
            return { error: true, msg: (e).response.data.msg };
        }
    }

    const logout = async () => {
        // Delete token from storage |
        await AsyncStorage.removeItem(TOKEN_KEY);
        // Update HTTP Headers
        axios.defaults.headers.common['Authorization'] = '';
        // Reset auth state
        setAuthState({
            token: null,
            authenticated: false
        });
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };


    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>;
};