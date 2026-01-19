import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../Screens/Profile";
import Settings from "../Screens/Settings";
import { ProfileStackParamList } from "../Types/screen.types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
