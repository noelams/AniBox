import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AniCard from "./AniCard";
import { EXPO_MAL_BASE_URL, EXPO_PERSONAL_CLIENT_ID } from "@env";

const AniCategories = ({ categoryTitle }) => {
  const [Anime, setAnime] = useState([]);

  useEffect(() => {
    fetch(`${EXPO_MAL_BASE_URL}/anime?q=naruto&limit=4`, {
      method: "GET",
      headers: {
        "X-MAL-CLIENT-ID": `${EXPO_PERSONAL_CLIENT_ID}`,
        "content-type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAnime(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{categoryTitle}</Text>
      <FlatList
        data={Anime}
        horizontal={true}
        keyExtractor={(item) => item.node.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <AniCard
              title={item.node.title}
              image={item.node.main_picture.medium}
            />
          );
        }}
      />
    </View>
  );
};

export default AniCategories;

const styles = StyleSheet.create({
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 10,
    marginVertical: 15,
    color: "#ffffff",
  },
});
