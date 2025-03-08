import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";
import AniCard from "./AniCard";

const AniCategories = ({ categoryTitle }) => {
  const titles = [
    "Title 1",
    "Title 2",
    "Title 3",
    "Title 4",
    "Title 5",
    "Title 6",
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{categoryTitle}</Text>
      <FlatList
        data={titles}
        horizontal={true}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return <AniCard title={item} />;
        }}
      />
    </View>
  );
};

export default AniCategories;

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: 18,
    fontWeight: "semibold",
    marginHorizontal: 10,
    marginVertical: 15,
    color: "#ffffff",
  },
});
