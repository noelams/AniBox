import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LogButtonProps } from "../Types/ui.types";

const LogButton = ({
  onPress,
  backgroundColor = Colors.primary,
  icon,
  customStyles,
  iconName,
}: LogButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.logButton,
        { backgroundColor: backgroundColor },
        customStyles,
      ]}
    >
      <MaterialCommunityIcons
        size={icon ?? 30}
        name={iconName ?? "plus"}
        color="#ffffff"
      />
    </TouchableOpacity>
  );
};

export default LogButton;

const styles = StyleSheet.create({
  logButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
