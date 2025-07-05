import { SafeAreaView, View, StyleSheet } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import ProfilePic from "../Components/ProfilePic";
import Colors from "../Constants/Colors";
import CoverPhoto from "../Components/CoverPhoto";
import SummaryBox from "../Components/SummaryBox";
import AniCategories from "../Components/AniCategories";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { AuthContext } from "../Context/AuthContext";
import AppText from "../Components/AppText";
import AniCard from "../Components/AniCard";

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentWatchedIds, setRecentWatchedIds] = useState([]);
  const [recentWatched, setRecentWatched] = useState([]);
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setprofileImage] = useState("");
  const { userToken } = useContext(AuthContext);
  const { backendUrl, malApiUrl, clientId } = Constants.expoConfig.extra;

  const handleCoverChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    console.log("Pressed");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };
  const handleProfileChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    console.log("Pressed");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setprofileImage(result.assets[0].uri);
    }
  };

  const getProfileData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/profile`, {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });
      setProfileData(response.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const getFavorites = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/favorites?limit=4`, {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      setFavoritesIds(response.json().animeid);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const fetchFavoritesFromApi = async () => {
    for (let id of favoritesIds) {
      const response = fetch(`${malApiUrl}/${id}?fields=title,main_picture`, {
        method: "GET",
        headers: {
          "X-MAL-CLIENT-ID": clientId,
          "content-type": "application/json",
        },
      });
      setFavorites((await response).json().data);
    }
  };

  const getRecentWatched = async () => {
    try {
      const response = fetch(
        `${backendUrl}/api/anime-log?status=watched&sort=desc&limit=4`,
        {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        }
      );

      setRecentWatchedIds(response.json().animeid);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const fetchRecentWatchedFromApi = async () => {
    for (let id of recentWatchedIds) {
      const response = fetch(`${malApiUrl}/${id}?fields=title,main_picture`, {
        method: "GET",
        headers: {
          "X-MAL-CLIENT-ID": clientId,
          "content-type": "application/json",
        },
      });
      setRecentWatched((await response).json().data);
    }
  };

  useEffect(() => {
    getProfileData();
    getFavorites();
    fetchFavoritesFromApi();
    getRecentWatched();
    fetchRecentWatchedFromApi();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <CoverPhoto
        onChangeCover={handleCoverChange}
        coverImage={coverImage}
        onChangeProfile={handleProfileChange}
        profileImage={profileImage}
        displayName={"Noel"}
      />
      <View style={styles.watchSummaryContainer}>
        <SummaryBox
          title={"Total Watch"}
          value={profileSummary.totalWatched}
          color={Colors.secondary}
        />
        <SummaryBox
          title={"Anime This Year"}
          value={profileData.watchedThisYear}
          color={Colors.primary}
        />
        <SummaryBox title={"Likes"} value={"8"} color={Colors.secondary} />
        <SummaryBox
          title={"Watchlist"}
          value={profileData.watchlist}
          color={Colors.primary}
        />
      </View>
      <View style={{ height: 1, backgroundColor: "gray", marginTop: 10 }} />

      <View style={styles.favoritesContainer}>
        <AppText
          title={"Noel's Favorites"}
          style={{ fontSize: 14, alignSelf: "center", marginTop: 10 }}
        />
        {favorites ? (
          <FlatList
            data={favorites}
            horizontal={true}
            keyExtractor={(favorite) => favorite.node.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ favorite }) => {
              return (
                <AniCard
                  title={favorite.node.title}
                  image={favorite.node.main_picture.medium}
                  id={favorite.node.id}
                />
              );
            }}
          />
        ) : (
          <AppText
            title={"No Favorites Yet"}
            style={{ fontSize: 24, alignSelf: "center", marginTop: 10 }}
          />
        )}
        <View style={{ height: 1, backgroundColor: "gray", marginTop: 10 }} />
        {recentWatched ? (
          <FlatList
            data={recentWatched}
            horizontal={true}
            keyExtractor={(recent) => recent.node.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ recent }) => {
              return (
                <AniCard
                  title={recent.node.title}
                  image={recent.node.main_picture.medium}
                  id={recent.node.id}
                />
              );
            }}
          />
        ) : (
          <AppText
            title={"Nothing Yet"}
            style={{ fontSize: 24, alignSelf: "center", marginTop: 10 }}
          />
        )}
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
});

export default Profile;
