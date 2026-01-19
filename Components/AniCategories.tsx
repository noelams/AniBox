import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AniCard from "./AniCard";
import Constants from "expo-constants";
import { AniCategoriesProps } from "../Types/screen.types";
import { AnimeResponse } from "../Types/animedata.types";

const configs = Constants.expoConfig?.extra;
const malApiUrl = configs?.malApiUrl;
const clientId = configs?.malClientId;

const AniCategories = ({ categoryTitle, animeObject }: AniCategoriesProps) => {
  const [Anime, setAnime] = useState<AnimeResponse | null>();
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when category changes.
    setLoading(true);
    setAnime(null);
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
        apiUrl = `${malApiUrl}/anime/ranking?ranking_type=all&limit=6`;
      } else if (categoryTitle === "Top Upcoming Anime") {
        apiUrl = `${malApiUrl}/anime/ranking?ranking_type=upcoming&limit=6`;
      } else if (categoryTitle === "Top Airing Anime") {
        apiUrl = `${malApiUrl}/anime/ranking?ranking_type=airing&limit=6`;
      } else if (categoryTitle === "Top Anime Movies") {
        apiUrl = `${malApiUrl}/anime/ranking?ranking_type=movie&limit=6`;
      }

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-MAL-CLIENT-ID": clientId,
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
          data={Anime?.data}
          horizontal={true}
          keyExtractor={(item) => item.node.id.toString()}
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
  container: {
    minHeight: 200,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 10,
    marginVertical: 15,
    color: "#ffffff",
  },
});
