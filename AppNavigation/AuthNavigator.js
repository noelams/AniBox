import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../Screens/SignIn";
import SignUp from "../Screens/SignUp";

const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Sign Up" component={SignUp} />
      <AuthStack.Screen name="Sign In" component={SignIn} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
