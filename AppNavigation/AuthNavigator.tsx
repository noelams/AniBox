import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../Screens/SignIn";
import SignUp from "../Screens/SignUp";
import { AuthNavigatorParamList } from "../Types/screen.types";

const AuthStack = createNativeStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Sign In" component={SignIn} />
      <AuthStack.Screen name="Sign Up" component={SignUp} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
