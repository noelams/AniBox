import { StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { WatchlistProvider } from "./Context/WatchlistContext";
import MainNavigator from "./AppNavigation/MainNavigator";
import AuthNavigator from "./AppNavigation/AuthNavigator";
import { AuthContext, AuthProvider } from "./Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";

const RootNavigator = () => {
  const [IsLoading, setIsLoading] = useState(true);
  const [UserToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setUserToken(token);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const logoutUser = () => {};

  if (IsLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <NavigationContainer style={styles.container}>
      {!UserToken ? <MainNavigator /> : <AuthNavigator />}
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
