import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";

const ErrorScreen = ({ onPress, screenName }) => {
  return (
    <View style={styles.container}>
      <Text>Error Loading {screenName}</Text>
      <Button onPress={onPress} title="Retry" />
    </View>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
  },
});
