import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomInput from "../Components/CustomInput";
import { AuthContext } from "../Context/AuthContext";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../Components/CustomButton";
import Colors from "../Constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomTitle from "../Components/CustomTitle";

const { backendUrl } = Constants.expoConfig.extra;

const SignUp = ({ navigation }) => {
  // const { signIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const handleSignUp = async () => {
    setLoading(true);
    console.log(formData);
    if (formData.confirmPassword !== formData.password) {
      Alert.alert("Password Mismatch", "Please Ensure your passwords match", [
        { text: "OK" },
      ]);
      setLoading(false);
      return;
    }
    const { confirmPassword: _, ...dataToSend } = formData; //exclude confirmPassword from the form and save the new object in dataToSend
    console.log(dataToSend);
    try {
      const sendData = await fetch(
        `http://192.168.24.201:5000/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const response = await sendData.json();
      console.log(response);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Error Signing up. Please try again", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => console.log(backendUrl), []);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={"../assets/icon.png"} style={styles.imageStyles} />
      <View>
        <CustomTitle
          title={"Sign Up"}
          subTitle={"Create an account to continue"}
        />
        <CustomInput
          icon={<Ionicons name="person" color={Colors.placeholder} size={16} />}
          placeholder="username"
          onChangeText={(text) =>
            setFormData((prev) => {
              return { ...prev, username: text };
            })
          }
        />
        <CustomInput
          icon={<Ionicons name="mail" color={Colors.placeholder} size={16} />}
          placeholder="Email"
          onChangeText={(text) =>
            setFormData((prev) => {
              return { ...prev, email: text };
            })
          }
        />
        <CustomInput
          icon={
            <Ionicons
              name="lock-closed-outline"
              color={Colors.placeholder}
              size={16}
            />
          }
          isPassword={true}
          placeholder="Password"
          onChangeText={(text) =>
            setFormData((prev) => {
              return { ...prev, password: text };
            })
          }
        />
        <CustomInput
          icon={
            <Ionicons
              name="lock-closed-outline"
              color={Colors.placeholder}
              size={16}
            />
          }
          isPassword={true}
          placeholder="Confirm Password"
          onChangeText={(text) =>
            setFormData((prev) => {
              return { ...prev, confirmPassword: text };
            })
          }
        />
        <CustomButton
          onPress={handleSignUp}
          disabled={loading}
          title={"Sign Up"}
        />
        <View style={styles.CTAcontainer}>
          <Text style={styles.CTAtext}>
            Already have an account? Go to the{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Sign In")}>
            <Text style={styles.goToLogin}>Login Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundColor,
    justifyContent: "center",
  },
  imageStyles: {
    borderColor: "#ffffff",
    borderWidth: 1,
    width: "100%",
  },
  CTAcontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
  CTAtext: {
    color: Colors.secondary,
  },
  goToLogin: {
    color: Colors.accent3,
    fontWeight: "bold",
  },
});
