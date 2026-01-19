//refactor absolute styling configurations

import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import Colors from "../Constants/Colors";
import { BackButtonProps } from "../Types/ui.types";
import { useNavigation } from "@react-navigation/native";

const BackButton = ({
  color,
  customContainerStyles,
  position,
  absolutePositionStyles,
  iconSize = 25,
  backgroundColor = "rgba(0,0,0,0.5)",
}: BackButtonProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[
        styles.backButtonContainer,
        position === "absolute" && { position: "absolute", backgroundColor },
        absolutePositionStyles,
        customContainerStyles,
      ]}
      onPress={() => navigation.goBack()}
    >
      <MaterialCommunityIcons
        name="arrow-left"
        size={iconSize}
        color={color ?? "#ffffff"}
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backButtonContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    // backgroundColor: Colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    zIndex: 10,
  },
});
