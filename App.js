import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { WatchlistProvider } from "./Context/WatchlistContext";
import MainNavigator from "./AppNavigation/MainNavigator";
import AuthNavigator from "./AppNavigation/AuthNavigator";

const userToken = false;

export default function App() {
  return (
    <WatchlistProvider>
      <NavigationContainer style={styles.container}>
        {userToken ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </WatchlistProvider>
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
