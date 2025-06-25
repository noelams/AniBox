import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const signIn = async (token) => {
    await AsyncStorage.setItem("token", token);
    setToken(token);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
