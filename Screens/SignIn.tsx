import React, { useContext } from "react";
import AuthForm from "../Components/AuthForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../Constants/Colors";
import { AuthContext } from "../Context/AuthContext";
import UserContext from "../Context/UserContext";
import { AuthField } from "../Types/ui.types";
import { SignInScreenProps } from "../Types/navigation.types";
import { createPostMutationHook } from "../api/Hooks/usePost";

const SignIn = ({ navigation }: SignInScreenProps) => {
  const { signIn } = useContext(AuthContext);
  const { saveUserInfo } = useContext(UserContext);

  const useLogin = createPostMutationHook<any, any>({
    endpoint: "/api/auth/login",
    requestDestination: "BACKEND",
    onSuccess: (data: any) => {
      const userData = data.user;
      saveUserInfo({
        ...userData,
      });
      signIn(data.token);
    },
    onError: (error: Error) => {
      throw new Error(error.message || "Login failed");
    },
  });
  const { mutateAsync } = useLogin();

  const fields: AuthField[] = [
    {
      name: "email",
      placeholder: "Email",
      icon: <Ionicons name="mail" color={Colors.placeholder} size={16} />,
    },
    {
      name: "password",
      placeholder: "Password",
      isPassword: true,
      icon: (
        <Ionicons
          name="lock-closed-outline"
          color={Colors.placeholder}
          size={16}
        />
      ),
    },
  ];

  const handleLogin = async (formData: Record<string, string>) => {
    await mutateAsync(formData);
  };

  return (
    <AuthForm
      title="Login"
      subTitle="Please sign in to continue"
      fields={fields}
      onSubmit={handleLogin}
      alternateText="Don't have an account?"
      alternateActionLabel="Sign Up Page"
      alternateActionTarget="Sign Up"
      image={require("../assets/anibox-auth.png")}
    />
  );
};

export default SignIn;
