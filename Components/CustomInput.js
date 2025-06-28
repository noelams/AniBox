import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";

const CustomInput = ({
  placeholder,
  onChangeText,
  value,
  isPassword,
  customInputContainerStyle,
  customInputStyle,
  keyboardType,
  icon,
}) => {
  return (
    <View style={[styles.container, customInputContainerStyle]}>
      {icon}
      <TextInput
        style={[styles.textInput, customInputStyle]}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
        secureTextEntry={isPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: Colors.accent2,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  textInput: {
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "RalewayMedium",
    width: "100%",
  },
});

export default CustomInput;
