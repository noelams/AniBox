import { StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { WatchlistProvider } from "./Context/WatchlistContext";
import MainNavigator from "./AppNavigation/MainNavigator";
import AuthNavigator from "./AppNavigation/AuthNavigator";
import { AuthContext, AuthProvider } from "./Context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import Colors from "./Constants/Colors";
import { UserInfoProvider } from "./Context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const RootNavigator = () => {
  const { userToken, IsLoading } = useContext(AuthContext);

  if (IsLoading) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <NavigationContainer style={styles.container}>
      {userToken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <UserInfoProvider>
          <AuthProvider>
            <WatchlistProvider>
              <RootNavigator />
            </WatchlistProvider>
          </AuthProvider>
        </UserInfoProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },
});
