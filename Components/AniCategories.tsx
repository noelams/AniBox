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
import {
  AniCategoriesProps,
  ProfileSummaryResponse,
} from "../Types/screen.types";
import { AnimeResponseItem } from "../Types/animedata.types";
import AppText from "./AppText";

const configs = Constants.expoConfig?.extra;
const malApiUrl = configs?.malApiUrl;
const clientId = configs?.clientId;

const AniCategories = <T,>({
  categoryTitle,
  animeObject,
  renderCard,
  keyExtractor,
}: AniCategoriesProps) => {
  const [anime, setAnime] = useState<
    AnimeResponseItem[] | ProfileSummaryResponse[] | null
  >(null);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when category changes.
    setLoading(true);
    setAnime(null);
    setError(null);
    // For ranking categories, use the existing logic:
    if (animeObject && animeObject.length > 0) {
      setAnime(animeObject);
      setLoading(false);
    } else {
      let apiUrl = "";
      if (categoryTitle === "Top Ranking Anime") {
        apiUrl = `${malApiUrl}/anime/ranking?ranking_type=all&limit=6`;
      } else if (categoryTitle === "Top Upcoming Anime") {
        apiUrl = `${malApiUrl}/anime/ranking?ranking_type=upcoming&limit=6`;
      } else if (categoryTitle === "Top Airing Anime") {
        apiUrl = `${malApiUrl}/anime/ranking?ranking_type=airing&limit=6`;
      } else if (categoryTitle === "Top Anime Movies") {
        apiUrl = `${malApiUrl}/anime/ranking?ranking_type=movie&limit=6`;
      } else {
        setLoading(false);
        setAnime([]);
        return;
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
          setError(err.message);
          setLoading(false);
        });
    }
  }, [categoryTitle, animeObject]);

  const defaultRenderCard = (item: AnimeResponseItem) => (
    <AniCard
      title={item.node.title}
      image={item.node.main_picture.medium}
      id={item.node.id}
    />
  );

  const defaultKeyExtractor = (item: AnimeResponseItem) =>
    item.node.id.toString();
  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{categoryTitle}</Text>
      {Loading ? (
        <ActivityIndicator size={"large"} color={"purple"} />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : (
        <>
          {anime?.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <AppText
                title="No Data available for this category"
                style={{ fontSize: 16 }}
              />
            </View>
          ) : (
            <FlatList
              data={anime as any[]}
              horizontal
              keyExtractor={keyExtractor ? keyExtractor : defaultKeyExtractor}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) =>
                renderCard ? renderCard(item) : defaultRenderCard(item)
              }
            />
          )}
        </>
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
