import { StyleSheet, Text } from "react-native";

const AppText = ({ title, style }) => {
  return <Text style={[styles.defaultText, style]}>{title}</Text>;
};

const styles = StyleSheet.create({
  defaultText: {
    color: "white",
    fontSize: 9,
  },
});
export default AppText;
