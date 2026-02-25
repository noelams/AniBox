import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "../Screens/Search";
import Colors from "../Constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import ProfileStack from "./ProfileStack";
import { BottomTabsParamList } from "../Types/navigation.types";

const Tab = createBottomTabNavigator<BottomTabsParamList>();
const MainNavigator = () => {
  return (
    <Tab.Navigator
      id={undefined}
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
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
