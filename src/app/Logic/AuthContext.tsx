import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
}

interface AuthContextProps {
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
  register: (token: string) => void;
  getDecodedToken: () => void;
  getUserLogin: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    isLoggedIn: false,
  });

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("token");
    } catch (error) {
      console.error("Couldn't get the token from AsyncStorage", error);
      return null;
    }
  };

  const getDecodedToken = async () => {
    const token = await getToken();
    console.log("token: " + token);
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Couldn't decode the token", error);
      return null;
    }
  };

  const getUserLogin = async () => {
    const decoded = await getDecodedToken();

    //TEST
    console.log("public_id: " + decoded.public_id);

    if (!decoded) return null;

    return decoded.username;
  };

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setState({ token, isLoggedIn: true });
      }
    };
    fetchToken();
  }, []);

  const login = async (token: string, userData) => {
    try {
      await AsyncStorage.setItem("token", token);
      console.log("Token saved successfully.");
      setState({ token, isLoggedIn: true });
    } catch (err) {
      console.log("Error saving token: ", err);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setState({ token: null, isLoggedIn: false });
  };

  const register = (token: string, userData) => {
    login(token, userData);
  };

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, getUserLogin, getDecodedToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
