import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";

const AniCard = ({ title, image }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.img} />
      <Text style={styles.title}>{title}</Text>
    </View>
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
