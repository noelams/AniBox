import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

const SignIn = () => {
  const { signIn } = useContext(AuthContext);
  // const [credentials, setCrdentials] = useState({ email: "", password: "" });

  const handleSignIn = async () => {
    const token = "vybsibsicbsdvi";
    await signIn(token);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign In</Text>
      <TextInput
        placeholder="Sign in with Email, Phone or Username"
        style={styles.input}
      />
      <TextInput placeholder="Password" style={styles.input} />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
