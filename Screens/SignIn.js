import React, { useContext } from "react";
import AuthForm from "../Components/AuthForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../Constants/Colors";
import { AuthContext } from "../Context/AuthContext";
import Constants from "expo-constants";

const { backendUrl } = Constants.expoConfig.extra;

const SignIn = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);

  const fields = [
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

  const handleLogin = async (formData) => {
    const sendData = await fetch(`${backendUrl}:5000/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(formData),
    });

    const response = await sendData.json();
    console.log(response);
    if (!sendData.ok) throw new Error(response.message || "Login failed");

    await signIn(response.token); // or however you're handling tokens
  };

  return (
    <AuthForm
      title="Login"
      subTitle="Please sign in to continue"
      fields={fields}
      onSubmit={handleLogin}
      navigation={navigation}
      alternateText="Don't have an account?"
      alternateActionLabel="Sign Up Page"
      alternateActionTarget="Sign Up"
      image={require("../assets/anibox-auth.png")}
    />
  );
};

export default SignIn;
