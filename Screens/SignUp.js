import React, { useContext } from "react";
import AuthForm from "../Components/AuthForm";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../Constants/Colors";
import Constants from "expo-constants";
import { AuthContext } from "../Context/AuthContext";

const { backendUrl } = Constants.expoConfig.extra;

const SignUp = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
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

  const handleSignUp = async (formData) => {
    // console.log("backend url:", backendUrl);
    const { confirmPassword, ...dataToSend } = formData;
    console.log(dataToSend);
    const sendData = await fetch(`${backendUrl}:5000/api/auth/signup`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    const response = await sendData.json();
    console.log(response);
    signIn(response.token);
    if (!sendData.ok) throw new Error(response.message || "Signup failed");
  };

  return (
    <AuthForm
      title="Sign Up"
      subTitle="Create an account to continue"
      fields={fields}
      onSubmit={handleSignUp}
      navigation={navigation}
      alternateText="Already have an account?"
      alternateActionLabel="Login Page"
      alternateActionTarget="Sign In"
      image={require("../assets/anibox-auth.png")}
    />
  );
};

export default SignUp;
