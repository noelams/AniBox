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
  const { userInfo } = useContext(UserContext);

  // Unified image picker
  const handleImageChange = async (onPick) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onPick(result.assets[0].uri);
      onPick(uri); // Update preview immediately
      uploadImageToBackend(uri, type); // Upload to backend
    }
  };

  const uploadImageToBackend = async (imageUri, type = "profile") => {
    try {
      const formData = new FormData();

      // Get the filename and extension
      const fileName = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName);
      const fileType = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: imageUri,
        name: fileName,
        type: fileType,
      });

      formData.append("userId", profileData._id); // You need this from getProfileData()

      const response = await fetch(`${backendUrl}/api/upload-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.imageUrl) {
        if (type === "profile") {
          setProfileImage(data.imageUrl);
        } else {
          setCoverImage(data.imageUrl);
        }

        // You can optionally refresh profileData:
        getProfileData();
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
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  };

  const getFavorites = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/favorites?limit=4`, {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      setFavoritesIds(data.animeid || []);
    } catch (err) {
      console.error("Error fetching favorites IDs:", err);
    }
  };

  const fetchFavoritesFromApi = async () => {
    const favoritesData = [];
    for (let id of favoritesIds) {
      try {
        const response = await fetch(
          `${malApiUrl}/${id}?fields=title,main_picture`,
          {
            method: "GET",
            headers: {
              "X-MAL-CLIENT-ID": clientId,
              "content-type": "application/json",
            },
          }
        );
        const data = await response.json();
        favoritesData.push(data);
      } catch (err) {
        console.error(`Error fetching anime with ID ${id}:`, err);
      }
    }
    setFavorites(favoritesData);
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
    const recentData = [];
    for (let id of recentWatchedIds) {
      try {
        const response = await fetch(
          `${malApiUrl}/${id}?fields=title,main_picture`,
          {
            method: "GET",
            headers: {
              "X-MAL-CLIENT-ID": clientId,
              "content-type": "application/json",
            },
          }
        );
        const data = await response.json();
        recentData.push(data);
      } catch (err) {
        console.error(`Error fetching anime with ID ${id}:`, err);
      }
    }
    setRecentWatched(recentData);
  };

  useEffect(() => {
    getProfileData();
    getFavorites();
    getRecentWatched();
    console.log(backendUrl);
  }, []);

  useEffect(() => {
    if (favoritesIds.length > 0) {
      fetchFavoritesFromApi();
    }
  }, [favoritesIds]);

  useEffect(() => {
    if (recentWatchedIds.length > 0) {
      fetchRecentWatchedFromApi();
    }
  }, [recentWatchedIds]);

  return (
    <SafeAreaView style={styles.container}>
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
          value={profileData?.totalWatched}
          color={Colors.secondary}
        />
        <SummaryBox
          title={"Anime This Year"}
          value={profileData?.watchedThisYear}
          color={Colors.primary}
        />
        <SummaryBox title={"Likes"} value={"8"} color={Colors.secondary} />
        <SummaryBox
          title={"Watchlist"}
          value={profileData?.watchlist}
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
          {favorites.length > 0 ? (
            <FlatList
              data={favorites}
              horizontal
              keyExtractor={(item) => item.node.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <AniCard
                  title={item.node.title}
                  image={item.node.main_picture.medium}
                  id={item.node.id}
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

        <View style={{ height: 1, backgroundColor: "gray", marginTop: 10 }} />

        <View style={styles.categoryContainer}>
          {recentWatched.length > 0 ? (
            <FlatList
              data={recentWatched}
              horizontal
              keyExtractor={(item) => item.node.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <AniCard
                  title={item.node.title}
                  image={item.node.main_picture.medium}
                  id={item.node.id}
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
});

export default Profile;
