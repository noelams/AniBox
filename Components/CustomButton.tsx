import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import { CustomButtonProps } from "../Types/ui.types";

const CustomButton = ({
  onPress,
  title,
  disabled,
  customStyles,
  customTextStyles,
}: CustomButtonProps) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        customStyles,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, customTextStyles]}>{title}</Text>
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
