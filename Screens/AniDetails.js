//Implement the rating component(or build one from scratch)
//Textarea for reviews
//complete modal set up and post request.

import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";

import Colors from "../Constants/Colors";
import AppText from "../Components/AppText";
import AniCategories from "../Components/AniCategories";
import WatchlistContext from "../Context/WatchlistContext";
import Constants from "expo-constants";
import BackButton from "../Components/BackButton";
import LogButton from "../Components/LogButton";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StatusButton from "../Components/StatusButton";
import { AuthContext } from "../Context/AuthContext";
import StarRating from "../Components/StarRating";
import CustomButton from "../Components/CustomButton";

const AniDetails = ({ route, navigation }) => {
  const id = route.params.id;
  const [AnimeData, setAnimeData] = useState([]);
  const { watchlist, toggleWatchlist } = useContext(WatchlistContext);
  const [statusColor, setStatusColor] = useState(null);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const { userToken } = useContext(AuthContext);
  const { malApiUrl, clientId, backendUrl } = Constants.expoConfig.extra;
  const [inputHeight, setInputHeight] = useState(0);
  const [logData, setLogData] = useState({
    review: "",
    status: null,
    score: null,
  });

  const isInWatchlist = watchlist.some((item) => item.id === id);

  useEffect(() => {
    const apiUrl = `${malApiUrl}/anime/${id}?fields=id,title,main_picture,start_date,end_date,synopsis,mean,rank,popularity,nsfw,created_at,updated_at,media_type,status,genres,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,recommendations,studios,statistics`;
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-MAL-CLIENT-ID": `${clientId}`,
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

  if (!AnimeData) return <Text>Loading</Text>;

  const handleUpdateLog = async () => {
    try {
      const data = {
        status: logData.status,
        animeId: id,
        review: logData.review,
        score: logData.score,
      };
      setIsloading(true);
      const response = fetch(`${backendUrl}/api/anime-log`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData);
    } catch (err) {
    } finally {
      setIsloading(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setLogData((prev) => ({
      ...prev,
      score: newRating,
    }));
  };
  useEffect(() => {
    if (status) {
      if (status === "not_yet_aired") {
        setStatusColor(Colors.lightGreen);
      } else if (status === "finished_airing") {
        setStatusColor(Colors.accent1);
      } else {
        setStatusColor(Colors.accent1);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        visible={modalIsVisible}
        animationType="slide"
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          {/* close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalIsVisible(false)}
          >
            <MaterialCommunityIcons name="close" size={25} color={"#ffffff"} />
          </TouchableOpacity>

          <ScrollView style={{ flex: 1 }}>
            <View style={styles.logStatusContainer}>
              <StatusButton
                iconName="eye"
                label={"Watched"}
                onPress={() =>
                  setLogData((prev) => ({
                    ...prev,
                    status: "watched",
                  }))
                }
              />
              <StatusButton
                iconName="plus"
                label={"Want to Watch"}
                onPress={() =>
                  setLogData((prev) => ({
                    ...prev,
                    status: "want to watch",
                  }))
                }
              />
              <StatusButton
                iconName="apple"
                label={"Watching"}
                onPress={() =>
                  setLogData((prev) => ({
                    ...prev,
                    status: "watching",
                  }))
                }
              />
            </View>
            <StarRating onRatingChange={handleRatingChange} />

            <View style={styles.inputContainer}>
              <TextInput
                editable
                multiline
                value={logData.review}
                maxLength={200}
                placeholder="Add a Review"
                placeholderTextColor={"#ffffff"}
                onChangeText={(text) => {
                  setLogData((prev) => ({ ...prev, review: text }));
                }}
                onContentSizeChange={(event) => {
                  setInputHeight(event.nativeEvent.contentSize.height);
                }}
                style={[
                  styles.textInput,
                  { height: Math.max(80, inputHeight) },
                ]}
              />
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
            <CustomButton
              onPress={() => {
                console.log("Log Data:", logData);
              }}
              title={"SAVE CHANGES"}
              customStyles={styles.saveButton}
              customTextStyles={{ fontWeight: "bold" }}
            />
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={styles.imageContainer}>
          {main_picture ? (
            <Image source={{ uri: main_picture?.large }} style={styles.img} />
          ) : (
            <Text>No Image Available</Text>
          )}
          <BackButton
            position={"absolute"}
            navigation={navigation}
            absolutePositionStyles={{ top: 10, left: 10 }}
          />
        </View>

        <View style={styles.statusContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.titleBlock}>
              <AppText
                title={status?.replace(/_/g, " ")}
                style={[styles.status, { color: statusColor }]}
              />
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
          <TouchableOpacity
            style={styles.watchlistBtn}
            onPress={() => toggleWatchlist(AnimeData)}
          >
            <AppText
              title={isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
              style={styles.watchlistText}
            />
          </TouchableOpacity>

          <View>
            <AppText title={"Ratings"} style={styles.ratingHeader} />
            <AppText title={mean / 2} style={styles.rating} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MyWatchlist");
          }}
          style={styles.gotoWatchlist}
        >
          <AppText title={"Go to Watchlist"} style={styles.gotoWatchlistText} />
        </TouchableOpacity>

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
      <LogButton
        customStyles={styles.logBtn}
        onPress={() => setModalIsVisible(true)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  //modal styles
  modal: {
    borderWidth: 1,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  modalContainer: {
    backgroundColor: Colors.backgroundColor,
    borderColor: Colors.accent2,
    flex: 1,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent2,
    margin: 10,
  },
  logStatusContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
  },
  inputContainer: {
    backgroundColor: Colors.accent2,
  },
  textInput: {
    textAlignVertical: "top",
  },
  modalFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundColor,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.accent3,
  },
  saveButton: {
    width: "100%",
  },

  //screen Content styles
  container: {
    paddingTop: 35,
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    position: "relative",
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
  gotoWatchlist: {
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
  logBtn: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});

export default AniDetails;
