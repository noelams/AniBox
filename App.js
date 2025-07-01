import { StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { WatchlistProvider } from "./Context/WatchlistContext";
import MainNavigator from "./AppNavigation/MainNavigator";
import AuthNavigator from "./AppNavigation/AuthNavigator";
import { AuthContext, AuthProvider } from "./Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";

const RootNavigator = () => {
  const { token, IsLoading } = useContext(AuthContext);

  if (IsLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <NavigationContainer style={styles.container}>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <RootNavigator />
      </WatchlistProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
