import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import React from "react";

const SignIn = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sign In</Text>
      <TextInput
        placeholder="Sign in with Email, Phone or Username"
        style={styles.input}
      />
      <TextInput placeholder="Password" style={styles.input} />
      <Button
        title="Sign In"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
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
