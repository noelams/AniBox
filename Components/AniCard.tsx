import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AniCardProps } from "../Types/animedata.types";
import { BottomTabsParamList } from "../Types/navigation.types";

const AniCard = ({ title, image, id }: AniCardProps) => {
  const navigation = useNavigation<NavigationProp<BottomTabsParamList>>();
  const handleNavigate = () => {
    navigation.navigate("Home", { screen: "AniDetails", params: { id } });
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <Image source={{ uri: image }} style={styles.img} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default AniCard;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 200,
    alignItems: "center",
    marginHorizontal: 10,
  },
  img: {
    width: "100%",
    resizeMode: "cover",
    borderRadius: 20,
    height: 150,
  },
  title: {
    color: Colors.secondary,
    textAlign: "center",
    fontSize: 10,
  },
});
