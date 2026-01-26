import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AniDetails from "../Screens/AniDetails";
import Home from "../Screens/Home";
import { HomeStackParamList } from "../Types/navigation.types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

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
    </Stack.Navigator>
  );
};

export default HomeStack;
