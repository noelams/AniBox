import React, { useContext } from "react";
import AuthForm from "../Components/AuthForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../Constants/Colors";
import { AuthContext } from "../Context/AuthContext";
import UserContext from "../Context/UserContext";
import { SignUpScreenProps } from "../Types/navigation.types";
import { createPostMutationHook } from "../api/Hooks/usePost";

const SignUp = ({ navigation }: SignUpScreenProps) => {
  const { saveUserInfo } = useContext(UserContext);
  const { signIn } = useContext(AuthContext);

  const useSignUpMutation = createPostMutationHook({
    endpoint: "/api/auth/signup",
    requestDestination: "BACKEND",
    onSuccess: (data: any) => {
      signIn(data.token);
      const userData = data.user;
      saveUserInfo({
        username: userData.username,
        email: userData.email,
        profileImage: userData.profileImage,
      });
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  const signUpMutation = useSignUpMutation();

  const fields = [
    {
      name: "username",
      placeholder: "Username",
      icon: <Ionicons name="person" color={Colors.placeholder} size={16} />,
    },
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
    {
      name: "confirmPassword",
      placeholder: "Confirm Password",
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

  const handleSignUp = async (formData: Record<string, string>) => {
    const { confirmPassword, ...dataToSend } = formData;
    await signUpMutation.mutateAsync(dataToSend);
  };

  return (
    <AuthForm
      title="Sign Up"
      subTitle="Create an account to continue"
      fields={fields}
      onSubmit={handleSignUp}
      alternateText="Already have an account?"
      alternateActionLabel="Login Page"
      alternateActionTarget="Sign In"
      image={require("../assets/anibox-auth.png")}
    />
  );
};

export default SignUp;
