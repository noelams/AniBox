import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (token) => {
    setIsLoading(true);
    await AsyncStorage.setItem("token", token);
    setToken(token);
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("token");
    setToken(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
