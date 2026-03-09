import { View, StyleSheet, ActivityIndicator } from "react-native";
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
import {
  ProfileDataResponse,
  profileFavoritesResponse,
  ProfileSummaryResponse,
} from "../Types/screen.types";
import { ProfileScreenProps } from "../Types/navigation.types";
import { SafeAreaView } from "react-native-safe-area-context";
import AniCategories from "../Components/AniCategories";
import { createGetQueryHook } from "../api/Hooks/useGet";
import { useQueries } from "@tanstack/react-query";

const Profile = ({ navigation }: ProfileScreenProps) => {
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const { userToken } = useContext(AuthContext);
  const configs = Constants?.expoConfig?.extra;
  const malApiUrl = configs?.malApiUrl;
  const backendUrl = configs?.backendUrl;
  const clientId = configs?.clientId;
  const { userInfo, updateUserInfo } = useContext(UserContext);

  const useGetProfileData = createGetQueryHook<ProfileDataResponse>({
    endpoint: "/api/profile",
    requestDestination: "BACKEND",
    queryKey: ["profile-data-3"],
  });

  const {
    data: profileData,
    isLoading: isLoadingProfileData,
    error,
  } = useGetProfileData();

  const handleImageChange = async (
    onPick: (uri: string) => void,
    type: string,
  ) => {
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

  const uploadImageToBackend = async (imageUri: string, type = "profile") => {
    try {
      setImageUploading(true);
      const formData: FormData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
        profileOrCover: type,
      } as any);

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

  const favoriteIds =
    profileData?.favorites?.map(
      (item: profileFavoritesResponse) => item.animeId,
    ) || [];

  const recentWatchedIds =
    profileData?.recentWatched?.map(
      (item: profileFavoritesResponse) => item.animeId,
    ) || [];

  const favorites = useQueries({
    queries: favoriteIds.map((id) => ({
      queryKey: ["favorite", id],
      queryFn: () => fetchFavoritesFromApi(id),
    })),
  });
  const finalFavorites: ProfileSummaryResponse[] = favorites?.map(
    (item) => item.data,
  );

  const recentWatched = useQueries({
    queries: recentWatchedIds.map((id) => ({
      queryKey: ["favorite", id],
      queryFn: () => fetchRecentWatchedFromApi(id),
    })),
  });
  const finalrecentWatched: ProfileSummaryResponse[] = recentWatched?.map(
    (item) => item.data,
  );

  const fetchFavoritesFromApi = async (id: string) => {
    try {
      const response = await fetch(
        `${malApiUrl}/anime/${id}?fields=title,main_picture`,
        {
          headers: {
            "X-MAL-CLIENT-ID": clientId,
            "content-type": "application/json",
          },
        },
      );

      if (!response.ok) {
        console.warn(`Failed to fetch anime ${id}: ${response.status}`);
        return null;
      }

      return response.json();
    } catch (err) {
      console.error("Error fetching favorites:", err);
      throw err;
    }
  };

  const fetchRecentWatchedFromApi = async (id: string) => {
    try {
      const response = await fetch(
        `${malApiUrl}/anime/${id}?fields=title,main_picture`,
        {
          headers: {
            "X-MAL-CLIENT-ID": clientId,
            "content-type": "application/json",
          },
        },
      );

      if (!response.ok) {
        console.warn(`Failed to fetch anime ${id}: ${response.status}`);
        return null;
      }

      return response.json();
    } catch (err) {
      console.error("Error fetching Recently Watched:", err);
      throw err;
    }
  };

  // Set initial images from userInfo
  useEffect(() => {
    if (userInfo?.profileImage) {
      setProfileImage(userInfo.profileImage);
    }
    if (userInfo?.coverImage) {
      setCoverImage(userInfo.coverImage);
    }
  }, [userInfo]);

  // Handle go back
  const handleGoBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  // Show error screen
  if (error !== null) {
    return (
      <ErrorScreen
        onRetry={() => console.log("reached")}
        onGoBack={handleGoBack}
        screenName="Profile"
        errorMessage={error.message}
        showGoBack={navigation ? true : false}
      />
    );
  }

  // Show loading screen
  if (isLoadingProfileData) {
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
            color={"secondary"}
          />
          <SummaryBox
            title={"Anime This Year"}
            value={profileData?.watchedThisYearCount || 0}
            color={"primary"}
          />
          <SummaryBox
            title={"Favorites"}
            value={profileData?.favoritesCount || 0}
            color={"secondary"}
          />
          <SummaryBox
            title={"Watchlist"}
            value={profileData?.watchlistCount || 0}
            color={"primary"}
          />
        </View>

        <View style={{ height: 1, backgroundColor: "gray", marginTop: 10 }} />

        <View>
          <View style={styles.categoryContainer}>
            <AniCategories
              categoryTitle="Your Favorites"
              animeObject={finalFavorites}
              renderCard={(item: ProfileSummaryResponse) => (
                <AniCard
                  title={item?.title}
                  id={item?.id}
                  image={item?.main_picture?.medium}
                />
              )}
              keyExtractor={(item: ProfileSummaryResponse) =>
                item?.id?.toString()
              }
            />
          </View>

          <View style={{ height: 1, backgroundColor: "gray", marginTop: 10 }} />

          <View style={styles.categoryContainer}>
            <View style={styles.categoryList}>
              <AniCategories
                categoryTitle="Recently Watched"
                animeObject={finalrecentWatched}
                renderCard={(item: ProfileSummaryResponse) => (
                  <AniCard
                    title={item?.title}
                    id={item?.id}
                    image={item?.main_picture?.medium}
                  />
                )}
                keyExtractor={(item: ProfileSummaryResponse) =>
                  item?.id?.toString()
                }
              />
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
