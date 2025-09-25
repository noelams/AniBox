import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import ConfirmModal from "../Components/ConfirmModal";

import Colors from "../Constants/Colors";
import AppText from "../Components/AppText";
import AniCategories from "../Components/AniCategories";
import Constants from "expo-constants";
import BackButton from "../Components/BackButton";
import LogButton from "../Components/LogButton";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StatusButton from "../Components/StatusButton";
import { AuthContext } from "../Context/AuthContext";
import CustomButton from "../Components/CustomButton";
import Toast from "react-native-toast-message";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import ErrorScreen from "./ErrorScreen";
import { Rating } from "react-native-ratings";

const AniDetails = ({ route, navigation }) => {
  const animeId = route.params.id;
  const [statusColor, setStatusColor] = useState(null);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const { userToken } = useContext(AuthContext);
  const { malApiUrl, clientId, backendUrl } = Constants.expoConfig.extra;
  const [inputHeight, setInputHeight] = useState(0);
  const [hasLog, setHasLog] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const queryClient = useQueryClient();

  const [paramsId, setParamsId] = useState(null);

  const [logData, setLogData] = useState({
    review: "",
    status: null,
    score: null,
    hasFavorite: false,
  });

  const { data: logResponse, isLoading } = useQuery({
    queryKey: ["anime-log", animeId],
    queryFn: () => handleLoadLog(animeId, userToken),
  });

  const {
    data: animeData,
    isLoading: animeDataIsloading,
    isError: animeDataIsError,
  } = useQuery({
    queryKey: ["anime-data", animeId],
    queryFn: () => fetchAnimeData(malApiUrl, animeId, clientId),
  });

  const { mutate: createLog, isLoading: isCreating } = useMutation({
    mutationFn: handleCreateLog,
    onSuccess: (newLog) => {
      queryClient.setQueryData(["anime-log", animeId], newLog);
      bottomSheetModalRef.current?.dismiss();
      showSuccessToast();
    },
    onError: showErrorToast,
  });

  const { mutate: updateLog, isLoading: isUpdating } = useMutation({
    mutationFn: handleUpdateLog,
    onSuccess: (updatedLog) => {
      queryClient.setQueryData(["anime-log", animeId], updatedLog);
      bottomSheetModalRef.current?.dismiss();
      showSuccessToast();
    },
    onError: showErrorToast,
  });

  const { mutate: deleteLog, isLoading: isDeleting } = useMutation({
    mutationFn: () => handleDeleteLog(),
    onSuccess: () => {
      queryClient.removeQueries(["anime-log", animeId]);
      setHasLog(false);
      showSuccessToast();
    },
    onError: showErrorToast,
  });

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
  } = animeData ?? {}; // useQuery initially returns undefined before populating animeData

  const fetchAnimeData = async (malApiUrl, animeId, clientId) => {
    try {
      const apiUrl = `${malApiUrl}/anime/${animeId}?fields=id,title,main_picture,start_date,end_date,synopsis,mean,rank,popularity,nsfw,created_at,updated_at,media_type,status,genres,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,recommendations,studios,statistics`;
      const fetchAnimeData = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-MAL-CLIENT-ID": `${clientId}`,
          "content-type": "application/json",
        },
      });

      const response = await fetchAnimeData.json();
      return response;
    } catch (err) {
      console.error("Error Fetching Anime Data", err);
      return null;
    }
  };

  const handleLoadLog = async (animeId, userToken) => {
    const fetchLogData = await fetch(
      `${backendUrl}/api/anime-log?animeId=${animeId}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${userToken}`,
          "content-type": "application/json",
        },
      }
    );

    if (!fetchLogData.ok) {
      throw new Error(`Error fetching log: ${logData.status}`);
    }
    const logData = await fetchLogData.json();

    console.log("Loaded Log Data:", logData);
    return logData && Object.keys(logData).length > 0 ? logData : null;
  };

  const handleCreateLog = async () => {
    try {
      const data = {
        status: logData.status,
        animeId: animeId,
        review: logData.review,
        score: logData.score,
      };
      console.log("Data:", data);
      const sendData = await fetch(`${backendUrl}/api/anime-log`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${userToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await sendData.json();
      console.log(response);
      if (sendData.ok) {
        setParamsId(response.savedLog._id);
        return response;
      } else {
        throw new Error(json.message || "Failed to create log");
      }
    } catch (err) {
      console.error("Error sending Log Data:", err);
      return null;
    }
  };
  const handleUpdateLog = async () => {
    if (!paramsId) {
      throw new Error("Log ID is missing, cannot update.");
    }

    try {
      const data = {
        status: logData.status,
        animeId: animeId,
        review: logData.review,
        score: logData.score,
      };
      console.log("Data:", data);

      const sendData = await fetch(`${backendUrl}/api/anime-log/${paramsId}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${userToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await sendData.json();
      if (sendData.ok) {
        return response;
      } else {
        throw new Error(json.message || "Failed to update log");
      }
    } catch (err) {
      console.error("Error sending Log Data:", err);
    }
  };

  const handleDeleteLog = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/anime-log?animeId=${animeId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${userToken}`,
            "content-type": "application/json",
          },
        }
      );
      const data = response.json();
      console.log(data);
    } catch (err) {
      console.error("Error deleting Log Data:", err);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      setIsFavoritesLoading(true);
      const res = await fetch(`${backendUrl}/api/favorites`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animeId: animeId }),
      });
      const data = await res.json();
      if (res.ok) {
        setLogData((prev) => {
          return { ...prev, hasFavorite: true };
        });
        console.log("Added to favorites:", data);
      } else {
        console.error("Failed to add to favorites:", data);
      }
    } catch (err) {
      console.error("Error fetching favorites IDs:", err);
    } finally {
      setIsFavoritesLoading(false);
    }
  };
  const handleRemoveFromFavorites = async () => {
    try {
      setIsFavoritesLoading(true);
      const response = await fetch(`${backendUrl}/api/favorites/${animeId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Deleted:", data);
        setLogData((prev) => {
          return { ...prev, hasFavorite: false };
        });
      } else {
        console.log("Failed to delete from favorites:", data);
      }
    } catch (err) {
      console.error("Error Removing Favorite:", err);
    } finally {
      setIsFavoritesLoading(false);
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
        setStatusColor(Colors.accent2);
      }
    }
  }, [status]);

  useEffect(() => {
    if (logResponse?.log) {
      setLogData({
        score: logResponse.log.score,
        review: logResponse.log.review,
        status: logResponse.log.status,
        hasFavorite: logResponse.log.isFavorite,
      });
      setParamsId(logResponse.log._id);
      setHasLog(true);
    } else {
      setHasLog(false);
    }
  }, [logResponse]);

  const showSuccessToast = () => {
    Toast.show({
      type: "success",
      text1: "Logged",
      text2: "Anime successfully logged",
    });
  };
  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Failed",
      text2: "Error logging Anime",
    });
  };

  const bottomSheetModalRef = useRef(null);
  const scrollRef = useRef(null);

  const snapPoints = useMemo(() => ["75%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const reloadScreen = () => {
    console.log("Retry button pressed");
  };

  if (isLoading || animeDataIsloading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>
          <ActivityIndicator size="large" color="#fff" />;
        </Text>
      </View>
    );
  }
  if (animeDataIsError) {
    return <ErrorScreen onPress={reloadScreen} screenName={"Anidetails"} />;
  }

  return (
    <View style={styles.container}>
      <BottomSheetModal
        style={styles.modal}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <BottomSheetScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps={"always"}
          style={styles.modalContainer}
        >
          {/* close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => bottomSheetModalRef.current?.dismiss()}
          >
            <MaterialCommunityIcons name="close" size={25} color={"#ffffff"} />
          </TouchableOpacity>

          <View style={styles.logStatusContainer}>
            <StatusButton
              iconName={logData.status === "watched" ? "eye" : "eye-outline"}
              label={"Watched"}
              onPress={() =>
                setLogData((prev) => ({
                  ...prev,
                  status: "watched",
                }))
              }
            />
            <StatusButton
              iconName={
                logData.status === "want to watch" ? "pin" : "pin-outline"
              }
              label={"Want to Watch"}
              onPress={() =>
                setLogData((prev) => ({
                  ...prev,
                  status: "want to watch",
                }))
              }
            />
            <StatusButton
              iconName={
                logData.status === "watching"
                  ? "play-circle"
                  : "play-circle-outline"
              }
              label={"Watching"}
              onPress={() =>
                setLogData((prev) => ({
                  ...prev,
                  status: "watching",
                }))
              }
            />
          </View>
          <View style={styles.modalRatingContainer}>
            <Rating
              type="star"
              ratingCount={5}
              onFinishRating={(rating) =>
                setLogData((prev) => ({
                  ...prev,
                  score: rating,
                }))
              }
            />
            <Text style={styles.modalRatingText}>Rate</Text>
          </View>

          <View style={styles.inputContainer}>
            <BottomSheetTextInput
              editable
              multiline
              value={logData.review}
              maxLength={200}
              placeholder="Add a Review"
              placeholderTextColor={Colors.placeholder}
              onChangeText={(text) => {
                setLogData((prev) => ({ ...prev, review: text }));
              }}
              onContentSizeChange={(event) => {
                setInputHeight(event.nativeEvent.contentSize.height);
              }}
              style={[styles.textInput, { height: Math.max(80, inputHeight) }]}
            />
          </View>
          <CustomButton
            title="Delete Log"
            onPress={() => setModalIsVisible(true)}
            disabled={!hasLog}
            customStyles={{
              backgroundColor: Colors.accent1,
              marginBottom: 20,
            }}
          />

          <View style={styles.modalFooter}>
            <CustomButton
              disabled={isCreating || isUpdating}
              onPress={() => {
                if (hasLog) {
                  updateLog();
                } else {
                  createLog();
                }
              }}
              title={
                isCreating || isUpdating ? (
                  <ActivityIndicator size={"small"} color={"purple"} />
                ) : (
                  "SAVE CHANGES"
                )
              }
              customStyles={styles.saveButton}
              customTextStyles={{ fontWeight: "bold" }}
            />
          </View>
          <ConfirmModal
            visible={modalIsVisible}
            onClose={() => setModalIsVisible(false)}
            onConfirm={() => deleteLog()}
            message="Are you sure you want to Delete this Log?"
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
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
          <View>
            <TouchableOpacity
              style={styles.favoritesBtn}
              onPress={
                logData.hasFavorite
                  ? handleRemoveFromFavorites
                  : handleAddToFavorites
              }
              disabled={isFavoritesLoading}
            >
              <AppText
                title={
                  isFavoritesLoading ? (
                    <ActivityIndicator size={"small"} color={"purple"} />
                  ) : logData.hasFavorite ? (
                    <Entypo name="add-to-list" size={24} color={"#fff"} />
                  ) : (
                    <MaterialIcons
                      name="format-align-left"
                      size={24}
                      color="#fff"
                    />
                  )
                }
                style={styles.watchlistText}
              />
            </TouchableOpacity>
            {logData.hasFavorite ? (
              <Text style={styles.favoriteLabel}>Add to Favorites </Text>
            ) : (
              <Text style={styles.favoriteLabel}>Added to Favorites</Text>
            )}
          </View>

          <View>
            <AppText title={"Ratings"} style={styles.ratingHeader} />
            <AppText title={mean ? mean / 2 : "N/A"} style={styles.rating} />
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
      <LogButton
        customStyles={styles.logBtn}
        onPress={handlePresentModalPress}
      />
      <Toast />
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
    paddingBottom: 80,
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
    justifyContent: "space-around",
    flexDirection: "row",
    marginVertical: 10,
    marginTop: 20,
  },
  modalRatingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 20,
    borderBottomColor: Colors.placeholder,
    borderTopColor: Colors.placeholder,
    borderWidth: 1,
  },
  modalRatingText: {
    color: "#ffffff",
    fontSize: 16,
  },
  inputContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: Colors.placeholder,
  },
  textInput: {
    textAlignVertical: "top",
    color: "#ffffff",
  },
  modalFooter: {
    // backgroundColor: Colors.backgroundColor,
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
  loadingContainer: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  favoritesBtn: {
    marginVertical: 10,
    backgroundColor: Colors.secondary,
    padding: 10,
    width: "50%",
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
