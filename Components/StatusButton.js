import { StyleSheet, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";

const StatusButton = ({
  iconName,
  size,
  iconColor = "#ffffff",
  customStyles,
  label,
  customLabelStyles,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[customStyles, styles.statusButton]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={size ?? 25}
        color={iconColor}
      />
      <Text style={[styles.label, customLabelStyles]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default StatusButton;

const styles = StyleSheet.create({
  statusButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
