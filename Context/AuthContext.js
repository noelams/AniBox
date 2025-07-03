import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (token) => {
    setIsLoading(true);
    await AsyncStorage.setItem("token", token);
    setUserToken(token);
    setIsLoading(false);
  };

  const signOut = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("token");
    setUserToken(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setUserToken(token);
        }
      } catch (err) {
        console.error("Token check error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
