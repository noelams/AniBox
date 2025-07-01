import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";

const CustomButton = ({ onPress, title, disabled }) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 10,
    alignSelf: "center",
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
