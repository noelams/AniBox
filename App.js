import { StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./AppNavigation/MainNavigator";
import AuthNavigator from "./AppNavigation/AuthNavigator";
import { AuthContext, AuthProvider } from "./Context/AuthContext";
import { useContext } from "react";
import Colors from "./Constants/Colors";
import { UserInfoProvider } from "./Context/UserContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UserInfoProvider>
              <RootNavigator />
            </UserInfoProvider>
          </AuthProvider>
        </QueryClientProvider>
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
