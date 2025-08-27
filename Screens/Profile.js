import { SafeAreaView, View, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import Colors from "../Constants/Colors";
import CoverPhoto from "../Components/CoverPhoto";
import SummaryBox from "../Components/SummaryBox";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { AuthContext } from "../Context/AuthContext";
import AppText from "../Components/AppText";
import AniCard from "../Components/AniCard";
import UserContext from "../Context/UserContext";
import { ScrollView } from "react-native-gesture-handler";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentWatchedIds, setRecentWatchedIds] = useState([]);
  const [recentWatched, setRecentWatched] = useState([]);
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const { userToken } = useContext(AuthContext);
  const { backendUrl, malApiUrl, clientId } = Constants.expoConfig.extra;
  const { userInfo, updateUserInfo } = useContext(UserContext);

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
      getProfileData();
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
        console.error("Upload failed", data);
      }
    } catch (err) {
      console.error("Upload error:", err);
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
      const data = await response.json();
      setProfileData(data);

      const favoritesId = data.favorites.map((item) => item.animeId);
      setFavoritesIds(favoritesId);
      if (data.profileImage) {
        setProfileImage(data.profileImage);
      }
      if (data.coverImage) {
        setCoverImage(data.coverImage);
      }
      console.log("profile data:", data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  };

  const fetchFavoritesFromApi = async () => {
    try {
      const results = await Promise.all(
        favoritesIds.map(async (id) => {
          const response = await fetch(
            `${malApiUrl}/anime/${id}?fields=title,main_picture`,
            {
              headers: {
                "X-MAL-CLIENT-ID": clientId,
                "content-type": "application/json",
              },
            }
          );
          return response.json();
        })
      );
      console.log("results:", results);
      setFavorites(results);
    } catch (err) {
      console.error("Error fetching favorites:", err);
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
      const data = await response.json();
      setRecentWatchedIds(data.animeid || []);
    } catch (err) {
      console.error("Error fetching recent watched:", err);
    }
  };

  const fetchRecentWatchedFromApi = async () => {
    try {
      const results = await Promise.all(
        recentWatchedIds.map(async (id) => {
          const response = await fetch(
            `${malApiUrl}/anime/${id}?fields=title,main_picture`,
            {
              headers: {
                "X-MAL-CLIENT-ID": clientId,
                "content-type": "application/json",
              },
            }
          );
          return response.json();
        })
      );
      setRecentWatched(results);
    } catch (err) {
      console.error("Error fetching Recently Watched:", err);
    }
  };

  useEffect(() => {
    getProfileData();
    getRecentWatched();
    console.log(backendUrl);
  }, [backendUrl, userToken]);

  useEffect(() => {
    if (favoritesIds?.length > 0) {
      fetchFavoritesFromApi();
    }
    console.log("Favorites:", favorites);
  }, [favoritesIds]);

  useEffect(() => {
    if (recentWatchedIds.length > 0) {
      fetchRecentWatchedFromApi();
    }
    console.log("Recently watched:", recentWatched);
  }, [recentWatchedIds]);

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

        <View style={styles.watchSummaryContainer}>
          <SummaryBox
            title={"Total Watch"}
            value={profileData?.totalWatchedCount}
            color={Colors.secondary}
          />
          <SummaryBox
            title={"Anime This Year"}
            value={profileData?.watchedThisYearCount}
            color={Colors.primary}
          />
          <SummaryBox
            title={"Favorites"}
            value={profileData?.favoritesCount}
            color={Colors.secondary}
          />
          <SummaryBox
            title={"Watchlist"}
            value={profileData?.watchlistCount}
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
                      image={item?.main_picture.medium}
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
                      image={item?.main_picture.medium}
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
