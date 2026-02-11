import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppText from "./AppText";
import { SummaryBoxProps } from "../Types/ui.types";
import Colors from "../Constants/Colors";

const SummaryBox = ({ value, title, color }: SummaryBoxProps) => {
  const resolvedColor = color ? Colors[color] : undefined;

  return (
    <View style={styles.container}>
      <Text style={{ color: resolvedColor, fontWeight: "bold", fontSize: 26 }}>
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
