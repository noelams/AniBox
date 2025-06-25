import { View, TextInput, StyleSheet } from "react-native";
import React from "react";

const CustomInput = ({
  placeholder,
  onChangeText,
  value,
  isPassword,
  customInputContainerStyle,
  customInputStyle,
}) => {
  return (
    <View style={[styles.container, customInputContainerStyle]}>
      <TextInput
        style={[styles.textInput, customInputStyle]}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
        secureTextEntry={isPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default CustomInput;
