import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import CustomInput from "../Components/CustomInput";
import { Button } from "react-native";
import { AuthContext } from "../Context/AuthContext";

const SignUp = () => {
  // const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    Password: "",
    confirmPassword: "",
    username: "",
  });

  const handleSignUp = async () => {
    setLoading(true);
    const { password, confirmPassword } = formData;
    if (confirmPassword !== password) {
      Alert.alert("Password Mismatch", "Please Ensure your passwords match", [
        { text: "OK" },
      ]);
      setLoading(false);
      return;
    }
    const { confirmPassword: _, ...dataToSend } = formData; //exclude confirmPassword from the form and save the new object in dataToSend
    try {
      const sendData = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        cache: "no-store",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const response = await sendData.json();
      console.log(response);
      // if(response._id)
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Error Signing up. Please try again", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <CustomInput
        placeholder="Email"
        onChangeText={(text) =>
          setFormData((prev) => {
            return { ...prev, email: text };
          })
        }
      />
      <CustomInput
        placeholder="username"
        onChangeText={(text) =>
          setFormData((prev) => {
            return { ...prev, username: text };
          })
        }
      />
      <CustomInput
        placeholder="Password"
        onChangeText={(text) =>
          setFormData((prev) => {
            return { ...prev, password: text };
          })
        }
      />
      <CustomInput
        placeholder="Confirm Password"
        onChangeText={(text) =>
          setFormData((prev) => {
            return { ...prev, confirmPassword: text };
          })
        }
      />

      <Button onPress={handleSignUp} disabled={loading} />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
