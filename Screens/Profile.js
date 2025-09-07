import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import Colors from "../Constants/Colors";
import CoverPhoto from "../Components/CoverPhoto";
import SummaryBox from "../Components/SummaryBox";
import ErrorScreen from "./ErrorScreen";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { AuthContext } from "../Context/AuthContext";
import AppText from "../Components/AppText";
import AniCard from "../Components/AniCard";
import UserContext from "../Context/UserContext";
import { ScrollView } from "react-native-gesture-handler";

const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState({});
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentWatchedIds, setRecentWatchedIds] = useState([]);
  const [recentWatched, setRecentWatched] = useState([]);
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const { userToken } = useContext(AuthContext);
  const { backendUrl, malApiUrl, clientId } = Constants.expoConfig.extra;
  const { userInfo, updateUserInfo } = useContext(UserContext);

  // Reset error state when retrying
  const resetError = () => {
    setError(null);
    setIsLoading(true);
  };

  const handleImageChange = async (onPick, type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      onPick(uri);
      uploadImageToBackend(uri, type);
    }
  };

  const uploadImageToBackend = async (imageUri, type = "profile") => {
    try {
      setImageUploading(true);
      console.log("Uploading image with URI:", imageUri);
      console.log("Backend URL:", backendUrl);
      console.log("User Info:", userInfo);

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
        profileOrCover: type,
      });

      formData.append("userId", userInfo?.id);

      const response = await fetch(`${backendUrl}/api/upload-profile`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Image Upload Data:", data);

      const imageFromCloudinary = data.imageUrl;

      if (imageFromCloudinary) {
        if (type === "profile") {
          setProfileImage(imageFromCloudinary);
          updateUserInfo({ newData: { profileImage: imageFromCloudinary } });
        } else {
          setCoverImage(imageFromCloudinary);
          updateUserInfo({ newData: { coverImage: imageFromCloudinary } });
        }
      } else {
        throw new Error("No image URL returned from server");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const getProfileData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/profile`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);

      const favoritesId = data.favorites?.map((item) => item.animeId) || [];
      setFavoritesIds(favoritesId);

      if (data.profileImage) {
        setProfileImage(data.profileImage);
      }
      if (data.coverImage) {
        setCoverImage(data.coverImage);
      }
      console.log("profile data:", data);
      return data;
    } catch (err) {
      console.error("Error fetching profile data:", err);
      throw err;
    }
  };

  const fetchFavoritesFromApi = async (ids) => {
    try {
      if (!ids || ids.length === 0) {
        setFavorites([]);
        return [];
      }

      const results = await Promise.all(
        ids.map(async (id) => {
          const response = await fetch(
            `${malApiUrl}/anime/${id}?fields=title,main_picture`,
            {
              headers: {
                "X-MAL-CLIENT-ID": clientId,
                "content-type": "application/json",
              },
            }
          );

          if (!response.ok) {
            console.warn(`Failed to fetch anime ${id}: ${response.status}`);
            return null;
          }

          return response.json();
        })
      );

      const validResults = results.filter((result) => result !== null);
      console.log("favorites results:", validResults);
      setFavorites(validResults);
      return validResults;
    } catch (err) {
      console.error("Error fetching favorites:", err);
      throw err;
    }
  };

  const getRecentWatched = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/anime-log?status=watched&sort=desc&limit=4`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch recent watched: ${response.status}`);
      }

      const data = await response.json();
      const recentIds = data.animeid || [];
      setRecentWatchedIds(recentIds);
      return recentIds;
    } catch (err) {
      console.error("Error fetching recent watched:", err);
      throw err;
    }
  };

  const fetchRecentWatchedFromApi = async (ids) => {
    try {
      if (!ids || ids.length === 0) {
        setRecentWatched([]);
        return [];
      }

      const results = await Promise.all(
        ids.map(async (id) => {
          const response = await fetch(
            `${malApiUrl}/anime/${id}?fields=title,main_picture`,
            {
              headers: {
                "X-MAL-CLIENT-ID": clientId,
                "content-type": "application/json",
              },
            }
          );

          if (!response.ok) {
            console.warn(`Failed to fetch anime ${id}: ${response.status}`);
            return null;
          }

          return response.json();
        })
      );

      const validResults = results.filter((result) => result !== null);
      setRecentWatched(validResults);
      return validResults;
    } catch (err) {
      console.error("Error fetching Recently Watched:", err);
      throw err;
    }
  };

  // Main data loading function
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load profile data first
      const profileData = await getProfileData();

      // Load recent watched
      const recentIds = await getRecentWatched();

      // Load external API data in parallel
      const [favoritesResults, recentWatchedResults] = await Promise.all([
        fetchFavoritesFromApi(
          profileData.favorites?.map((item) => item.animeId) || []
        ),
        fetchRecentWatchedFromApi(recentIds),
      ]);
    } catch (err) {
      console.error("Error loading profile data:", err);
      setError({
        message: "Failed to load profile data",
        details: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [backendUrl, userToken]);

  // Set initial images from userInfo
  useEffect(() => {
    if (userInfo?.profileImage) {
      setProfileImage(userInfo.profileImage);
    }
    if (userInfo?.coverImage) {
      setCoverImage(userInfo.coverImage);
    }
  }, [userInfo]);

  // Handle retry
  const handleRetry = () => {
    loadAllData();
  };

  // Handle go back
  const handleGoBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  // Show error screen
  if (error && !isLoading) {
    return (
      <ErrorScreen
        onRetry={handleRetry}
        onGoBack={handleGoBack}
        screenName="Profile"
        errorMessage={error.message}
        showGoBack={navigation ? true : false}
      />
    );
  }

  // Show loading screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <AppText title="Loading your profile..." style={styles.loadingText} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <CoverPhoto
          onChangeCover={() => handleImageChange(setCoverImage, "cover")}
          coverImage={coverImage}
          onChangeProfile={() => handleImageChange(setProfileImage, "profile")}
          profileImage={profileImage}
          displayName={userInfo?.username}
        />

        {imageUploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <AppText title="Uploading..." style={styles.uploadingText} />
          </View>
        )}

        <View style={styles.watchSummaryContainer}>
          <SummaryBox
            title={"Total Watch"}
            value={profileData?.totalWatchedCount || 0}
            color={Colors.secondary}
          />
          <SummaryBox
            title={"Anime This Year"}
            value={profileData?.watchedThisYearCount || 0}
            color={Colors.primary}
          />
          <SummaryBox
            title={"Favorites"}
            value={profileData?.favoritesCount || 0}
            color={Colors.secondary}
          />
          <SummaryBox
            title={"Watchlist"}
            value={profileData?.watchlistCount || 0}
            color={Colors.primary}
          />
        </View>

        <View style={{ height: 1, backgroundColor: "gray", marginTop: 10 }} />

        <View style={styles.favoritesContainer}>
          <View style={styles.categoryContainer}>
            <AppText
              title={"Your Favorites"}
              style={{ fontSize: 14, alignSelf: "center", marginTop: 10 }}
            />
            <View style={styles.categoryList}>
              {favorites.length > 0 ? (
                <FlatList
                  data={favorites}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <AniCard
                      title={item?.title}
                      image={item?.main_picture?.medium}
                      id={item?.id}
                    />
                  )}
                />
              ) : (
                <AppText
                  title={"No Favorites Yet"}
                  style={{ fontSize: 18, alignSelf: "center", marginTop: 10 }}
                />
              )}
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: "gray", marginTop: 10 }} />

          <View style={styles.categoryContainer}>
            <AppText
              title={"Recently Watched"}
              style={{ fontSize: 14, alignSelf: "center", marginTop: 10 }}
            />
            <View style={styles.categoryList}>
              {recentWatched.length > 0 ? (
                <FlatList
                  data={recentWatched}
                  horizontal
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <AniCard
                      title={item?.title}
                      image={item?.main_picture?.medium}
                      id={item?.id}
                    />
                  )}
                />
              ) : (
                <AppText
                  title={"Nothing Watched Recently"}
                  style={{ fontSize: 18, alignSelf: "center", marginTop: 10 }}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textColor || "#666",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 10,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1000,
  },
  uploadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "white",
  },
  watchSummaryContainer: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  categoryContainer: {
    minHeight: 130,
  },
  categoryList: {
    justifyContent: "center",
  },
});

export default Profile;
