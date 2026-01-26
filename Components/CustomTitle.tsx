import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { CustomTitleProps } from "../Types/ui.types";

const CustomTitle = ({ title, subTitle }: CustomTitleProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
    </View>
  );
};

export default CustomTitle;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subTitle: {
    fontSize: 18,
    color: "#ffffff",
  },
});
