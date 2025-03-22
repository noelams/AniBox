import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EXPO_MAL_BASE_URL, EXPO_PERSONAL_CLIENT_ID } from "@env";
import Colors from "../Constants/Colors";
import AppText from "../Components/AppText";
import AniCategories from "../Components/AniCategories";

const AniDetails = ({ route }) => {
  const id = route.params.id;
  const [AnimeData, setAnimeData] = useState([]);

  useEffect(() => {
    const apiUrl = `${EXPO_MAL_BASE_URL}/anime/${id}?fields=id,title,main_picture,start_date,end_date,synopsis,mean,rank,popularity,nsfw,created_at,updated_at,media_type,status,genres,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,recommendations,studios,statistics`;
    fetch(apiUrl, {
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
        // console.log(data);
        setAnimeData(data);
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []);

  if (!AnimeData) return <Text>Loading</Text>;

  const {
    title,
    main_picture,
    start_date,
    end_date,
    synopsis,
    mean,
    rank,
    popularity,
    nsfw,
    created_at,
    updated_at,
    media_type,
    status,
    genres,
    num_episodes,
    start_season,
    broadcast,
    source,
    average_episode_duration,
    rating,
    pictures,
    background,
    related_anime,
    recommendations,
    studios,
    statistics,
  } = AnimeData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {main_picture ? (
          <Image source={{ uri: main_picture?.large }} style={styles.img} />
        ) : (
          <Text>No Image Available</Text>
        )}
      </View>

      <View style={styles.statusContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.titleBlock}>
            <AppText title={status?.replace(/_/g, " ")} style={styles.status} />
            <View style={styles.titleContainer}>
              <AppText title={title} style={styles.title} />
              <AppText
                title={start_date?.split("-")[0]}
                style={styles.startDate}
              />
            </View>
            <AppText
              title={`Studios: ${studios
                ?.map((studio) => studio.name)
                .join(", ")}`}
              style={styles.startDate}
            />
          </View>

          <View style={styles.animeInfo}>
            <AppText
              title={`Number of Episodes:${num_episodes}`}
              style={styles.info}
            />
            <AppText
              style={styles.info}
              title={`Average Episode Duration:
              ${Math.floor(average_episode_duration / 60)} minutes`}
            />
          </View>
        </View>
      </View>
      {/* <Text>{start_season}</Text> */}
      <View style={styles.synopsisContainer}>
        <AppText title={synopsis} style={styles.synopsis} />
        {nsfw === "white" ? null : <Text style={styles.nsfw}>NSFW</Text>}
      </View>

      <View style={styles.ratingContainer}>
        <TouchableOpacity style={styles.watchlistBtn}>
          {/* <FontAwesome name="line-chart" size={30} color="black" /> */}
          <AppText title="Add to Watchlist" style={styles.watchlistText} />
        </TouchableOpacity>
        <View>
          <AppText title={"Ratings"} style={styles.ratingHeader} />
          <AppText title={mean / 2} style={styles.rating} />
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: "gray", marginTop: 30 }} />
      <AniCategories
        categoryTitle={"Recommended For You"}
        animeObject={recommendations}
      />
      <AniCategories
        categoryTitle={"Similar Anime"}
        animeObject={related_anime}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 35,
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 250,
  },
  img: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  statusContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  status: {
    fontWeight: "bold",
    fontSize: 11,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  studios: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  startDate: {
    marginLeft: 5,
    fontSize: 7,
  },
  animeInfo: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  synopsisContainer: {
    marginHorizontal: 20,
  },
  synopsis: {},
  nsfw: {
    backgroundColor: Colors.accent1,
    borderRadius: 3,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  watchlistBtn: {
    marginVertical: 10,
    backgroundColor: Colors.secondary,
    padding: 8,
    width: "30%",
    borderRadius: 7,
    alignItems: "center",
  },
  watchlistText: {
    color: "#333",
    fontWeight: "bold",
  },
  ratingHeader: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
  },
  rating: {
    color: Colors.secondary,
  },
});

export default AniDetails;
