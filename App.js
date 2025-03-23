import { StyleSheet } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Home from "./Screens/Home";
import Profile from "./Screens/Profile";
import Search from "./Screens/Search";
import Colors from "./Constants/Colors";
import AniDetails from "./Screens/AniDetails";
import MyWatchlist from "./Screens/MyWatchlist";
import { WatchlistProvider } from "./Context/WatchlistContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AniDetails"
        component={AniDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyWatchlist"
        component={MyWatchlist}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <WatchlistProvider>
      <NavigationContainer style={styles.container}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#E9A6A6",
            tabBarInactiveTintColor: "#8F8E9A",
            tabBarStyle: { backgroundColor: Colors.backgroundColor },
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={Search}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="search" size={20} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="person" size={20} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
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

//
