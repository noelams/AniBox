import React from "react";
import { Button, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AniDetails = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>AniDetails</Text>
      <Button
        title="Go Back"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default AniDetails;
