import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import CustomButton from "../Components/CustomButton";
import CustomInput from "../Components/CustomInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../Constants/Colors";
import CustomTitle from "../Components/CustomTitle";
const SignIn = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  // const [credentials, setCrdentials] = useState({ email: "", password: "" });

  const handleSignIn = async () => {
    const token = "vybsibsicbsdvi";
    await signIn(token);
  };
  const handleForgotPassword = () => {
    //coming soon
  };
  return (
    <SafeAreaView style={styles.appContainer}>
      <Image source={"../assets/my_picture.jpg"} style={styles.imageStyles} />
      <View style={styles.container}>
        <CustomTitle title="Login" subTitle={"Please sign in to continue"} />
        <CustomInput
          icon={<Ionicons name="mail" color={Colors.placeholder} size={16} />}
          isPassword={true}
          placeholder="Email"
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
          placeholder="Password"
          onChangeText={(text) =>
            setFormData((prev) => {
              return { ...prev, password: text };
            })
          }
        />

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}> Forgot Password?</Text>
        </TouchableOpacity>
        <CustomButton title={"Login"} />
        <View style={styles.CTAcontainer}>
          <Text style={styles.CTAtext}>Don't have an account? Go to the </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Sign Up")}>
            <Text style={styles.goToLogin}>Sign Up Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  imageStyles: {
    width: "100%",
    height: 100,
    backgroundColor: "#ffffff",
    flex: 1,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: Colors.accent3,
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
