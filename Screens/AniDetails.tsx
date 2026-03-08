// @ts-check
//change studio type from any to correct type later
//set status text color based off status

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
  Modal,
  TextInput,
} from "react-native";

import Colors, { ColorKey } from "../Constants/Colors";
import AppText from "../Components/AppText";
import AniCategories from "../Components/AniCategories";
import Constants from "expo-constants";
import BackButton from "../Components/BackButton";
import LogButton from "../Components/LogButton";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../Context/AuthContext";
import Toast from "react-native-toast-message";
import { ScrollView } from "react-native-gesture-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ErrorScreen from "./ErrorScreen";
import { AnimeDataType, AnimeLogData } from "../Types/animedata.types";
import { AniDetailsScreenProps } from "../Types/navigation.types";
import LogModal from "../Components/LogModal";
import { createGetQueryHook } from "../api/Hooks/useGet";

const AniDetails = ({ route }: AniDetailsScreenProps) => {
  const animeId = route.params.id;
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);
  const { userToken } = useContext(AuthContext);
  const configs = Constants?.expoConfig?.extra;
  const malApiUrl = configs?.malApiUrl;
  const backendUrl = configs?.backendUrl;
  const clientId = configs?.clientId;
  const [hasLog, setHasLog] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [logData, setLogData] = useState<AnimeLogData>({
    review: "",
    status: null,
    score: 0,
    hasFavorite: false,
  });

  const queryClient = useQueryClient();
  const [paramsId, setParamsId] = useState(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const scrollRef = useRef(null);

  const snapPoints = useMemo(() => ["75%"], []);

  const { data: logResponse, isLoading } = useQuery({
    queryKey: ["anime-log", animeId],
    queryFn: () => handleLoadLog(animeId, userToken),
  });

  const useGetAnimeData = createGetQueryHook<AnimeDataType>({
    endpoint: `/anime/${animeId}`,
    queryKey: [`anime-data-${animeId}`],
    requestDestination: "MAL",
  });

  const {
    data: animeData,
    isLoading: animeDataIsloading,
    isError: animeDataIsError,
    error,
  } = useGetAnimeData({
    query: {
      fields:
        "title,main_picture,start_date,synopsis,mean,nsfw,status,num_episodes,average_episode_duration,related_anime,recommendations,studios",
    },
  });

  console.log("custom hook anime data", animeData, error);

  const {
    title,
    main_picture,
    start_date,
    synopsis,
    mean,
    nsfw,
    status,
    num_episodes,
    average_episode_duration,
    related_anime,
    recommendations,
    studios,
  } = animeData ?? {}; // useQuery initially returns undefined before populating animeData

  const handleLoadLog = async (animeId: number, userToken: string) => {
    const fetchLogData = await fetch(
      `${backendUrl}/api/anime-log?animeId=${animeId}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${userToken}`,
          "content-type": "application/json",
        },
      },
    );

    if (!fetchLogData.ok) {
      throw new Error(`Error fetching log: ${fetchLogData.status}`);
    }
    const logData = await fetchLogData.json();
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
      const sendData = await fetch(`${backendUrl}/api/anime-log`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${userToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await sendData.json();
      if (sendData.ok) {
        setParamsId(response.savedLog._id);
        return response;
      } else {
        throw new Error(response.message || "Failed to create log");
      }
    } catch (err) {
      throw err;
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
        throw new Error(response.message || "Failed to update log");
      }
    } catch (err) {
      throw err;
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
        },
      );
      const data = response.json();
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

  const reloadScreen = async () => {
    try {
      await queryClient.refetchQueries({ queryKey: ["anime-log", animeId] });
      await queryClient.refetchQueries({ queryKey: ["anime-data", animeId] });
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  const { mutateAsync: createLog, isPending: isCreating } = useMutation({
    mutationFn: handleCreateLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-log", animeId] });
      setModalIsVisible(false);
      showSuccessToast();
    },
    onError: () => {
      setModalIsVisible(false);
      showErrorToast();
    },
  });

  const { mutateAsync: updateLog, isPending: isUpdating } = useMutation({
    mutationFn: handleUpdateLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anime-log", animeId] });
      setModalIsVisible(false);
      showSuccessToast();
    },
    onError: () => {
      setModalIsVisible(false);
      showErrorToast();
    },
  });

  const { mutateAsync: deleteLog } = useMutation({
    mutationFn: () => handleDeleteLog(),
    onError: showErrorToast,
    onSuccess: () => {
      queryClient.removeQueries({ [`anime-log-${animeId}`]: true });
      setHasLog(false);
      showSuccessToast();
    },
  });

  if (animeDataIsloading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>
          <ActivityIndicator size="large" color={Colors.primary} />;
        </Text>
      </View>
    );
  }

  if (animeDataIsError) {
    return <ErrorScreen onRetry={reloadScreen} screenName={"Anidetails"} />;
  }

  return (
    <View style={styles.container}>
      <LogModal
        modalIsVisible={modalIsVisible}
        setModalIsVisible={setModalIsVisible}
        title={title}
        main_picture={main_picture}
        start_date={start_date}
        logData={logData}
        setLogData={setLogData}
        hasLog={hasLog}
        onSubmit={hasLog ? updateLog : createLog}
        isLoading={isCreating || isUpdating}
      />
      <BackButton
        position={"absolute"}
        absolutePositionStyles={{ top: 40, left: 10 }}
      />
      <ScrollView>
        <View style={styles.imageContainer}>
          {main_picture ? (
            <Image source={{ uri: main_picture?.large }} style={styles.img} />
          ) : (
            <Text>No Image Available</Text>
          )}
        </View>

        <View style={styles.statusContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <AppText
                title={status?.replace(/_/g, " ")}
                style={styles.status}
              />
              <View style={styles.titleContainer}>
                <AppText title={title} style={styles.title} numberOfLines={2} />
                <AppText
                  title={start_date?.split("-")[0]}
                  style={styles.startDate}
                />
              </View>
              <AppText
                title={`Studios: ${studios
                  ?.map((studio: any) => studio.name)
                  .join(", ")}`}
                style={styles.startDate}
              />
            </View>

            <View style={styles.animeInfo}>
              <View>
                <AppText title={`Episodes`} style={styles.animeInfoItem} />
                <AppText
                  title={num_episodes ? num_episodes.toString() : "N/A"}
                />
              </View>

              <View>
                <AppText title={`Avg Duration`} style={styles.animeInfoItem} />
                <AppText
                  title={
                    average_episode_duration
                      ? `${Math.floor(average_episode_duration / 60)} mins`
                      : "N/A"
                  }
                />
              </View>
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
            {!logData.hasFavorite ? (
              <TouchableOpacity
                onPress={handleAddToFavorites}
                style={styles.favoritesBtn}
                disabled={isFavoritesLoading}
              >
                <View style={styles.favoriteInnerContainer}>
                  <MaterialIcons
                    name="format-align-left"
                    size={18}
                    color="#333"
                  />
                  <Text style={styles.favoriteText}>Add to Favorites </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.favoritesBtn}
                onPress={handleRemoveFromFavorites}
                disabled={isFavoritesLoading}
              >
                <View style={styles.favoriteContainer}>
                  <View style={styles.favoriteInnerContainer}>
                    <Entypo name="add-to-list" size={18} color={"#333"} />

                    <Text style={styles.favoriteText}>Added to Favorites</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.ratingDataContainer}>
            <AppText title={"Ratings"} style={styles.ratingHeader} />
            <AppText
              title={mean ? (mean / 2).toFixed(1) : "N/A"}
              style={styles.rating}
            />
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
        onPress={() => setModalIsVisible(true)}
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
    flex: 1,
    borderColor: Colors.accent2,
    paddingBottom: 80,
    gap: 20,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 50,
  },
  modalImageContainer: {
    flexDirection: "row",
    width: "100%",
    height: 200,
  },
  modalImg: {
    width: 150,
    height: "100%",
    borderRadius: 10,
  },

  reviewInputContainer: {
    minHeight: 120,
    marginHorizontal: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  textInput: {
    padding: 12,
    color: "#fff",
    fontSize: 14,
    height: 120,
    backgroundColor: "#3D3B54",
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
  modalFooter: {
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    maxWidth: "75%",
    color: "white",
  },
  studios: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  startDate: {
    marginLeft: 5,
    fontSize: 10,
  },
  animeInfo: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 2,
  },
  animeInfoItem: {
    fontWeight: "bold",
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
    alignItems: "center",
    marginHorizontal: 10,
  },
  favoritesBtn: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.secondary,
    padding: 3,
    width: "50%",
    borderRadius: 7,
    alignItems: "center",
  },
  favoriteContainer: {
    color: "#333",
    fontWeight: "bold",
    width: "100%",
    flexDirection: "row",
  },
  favoriteInnerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteText: { fontSize: 8 },
  ratingDataContainer: {
    alignItems: "center",
  },
  ratingHeader: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
  },
  rating: {
    color: Colors.secondary,
    fontSize: 26,
  },
  logBtn: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});

export default AniDetails;
