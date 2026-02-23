import { StyleSheet, Text } from "react-native";
import { AppTextProps } from "../Types/ui.types";

const AppText = ({ title, style, numberOfLines = 1 }: AppTextProps) => {
  return (
    <Text style={[styles.defaultText, style]} numberOfLines={numberOfLines}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    color: "white",
    fontSize: 9,
  },
});
export default AppText;
