import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppText from "./AppText";
import { SummaryBoxProps } from "../Types/ui.types";

const SummaryBox = ({ value, title, color }: SummaryBoxProps) => {
  return (
    <View style={styles.container}>
      <Text style={{ color: color, fontWeight: "bold", fontSize: 26 }}>
        {value ? value : 0}
      </Text>
      <AppText title={title} style={{ fontSize: 14 }} />
    </View>
  );
};

export default SummaryBox;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: 10,
  },
});
