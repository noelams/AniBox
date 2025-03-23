import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AniCard from "./AniCard";
import { EXPO_MAL_BASE_URL, EXPO_PERSONAL_CLIENT_ID } from "@env";

const AniCategories = ({ categoryTitle, animeObject }) => {
  const [Anime, setAnime] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when category changes.
    setLoading(true);
    setAnime([]);
    setError(null);

    if (categoryTitle === "Recommended For You") {
      setAnime(animeObject);
      setLoading(false);
    } else if (categoryTitle === "Similar Anime") {
      setAnime(animeObject);
      setLoading(false);
    } else {
      // For ranking categories, use the existing logic:
      let apiUrl = "";
      if (categoryTitle === "Top Ranking Anime") {
        apiUrl = `${EXPO_MAL_BASE_URL}/anime/ranking?ranking_type=all&limit=6`;
      } else if (categoryTitle === "Top Upcoming Anime") {
        apiUrl = `${EXPO_MAL_BASE_URL}/anime/ranking?ranking_type=upcoming&limit=6`;
      } else if (categoryTitle === "Top Airing Anime") {
        apiUrl = `${EXPO_MAL_BASE_URL}/anime/ranking?ranking_type=airing&limit=6`;
      } else if (categoryTitle === "Top Anime Movies") {
        apiUrl = `${EXPO_MAL_BASE_URL}/anime/ranking?ranking_type=movie&limit=6`;
      }

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-MAL-CLIENT-ID": EXPO_PERSONAL_CLIENT_ID,
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setAnime(data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
          setLoading(false);
        });
    }
  }, [categoryTitle, animeObject]);
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{categoryTitle}</Text>
      {Loading ? (
        <ActivityIndicator size={"large"} color={"purple"} />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
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
                id={item.node.id}
              />
            );
          }}
        />
      )}
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
