import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, createContext, useEffect } from "react";

const UserContext = createContext();

export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null); // Start with null for clarity
  const [loading, setLoading] = useState(true);

  const saveUserInfo = async (userObject) => {
    try {
      await AsyncStorage.setItem("userInfo", JSON.stringify(userObject));
      setUserInfo(userObject);
    } catch (err) {
      console.error("Error saving user info:", err);
    }
  };

  const updateUserInfo = async ({ newData }) => {
    setUserInfo((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const loadUserInfo = async () => {
    try {
      const storedInfo = await AsyncStorage.getItem("userInfo");
      if (storedInfo) {
        setUserInfo(JSON.parse(storedInfo));
      }
    } catch (err) {
      console.error("Error loading user info:", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear userInfo (on logout, for example)
  const clearUserInfo = async () => {
    try {
      await AsyncStorage.removeItem("userInfo");
      setUserInfo(null);
    } catch (err) {
      console.error("Error clearing user info:", err);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  return (
    <UserContext.Provider
      value={{ userInfo, saveUserInfo, clearUserInfo, loading, updateUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
