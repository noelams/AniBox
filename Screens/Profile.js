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

const Profile = () => {
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setprofileImage] = useState("");
  const { userToken } = useContext(AuthContext);
  const { backendUrl } = Constants.expoConfig.extra;

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

  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/auth/profile`, {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        });
        console.log(response.data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    getProfileDetails();
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
          value={"100"}
          color={Colors.secondary}
        />
        <SummaryBox
          title={"Anime This Year"}
          value={"40"}
          color={Colors.primary}
        />
        <SummaryBox title={"Likes"} value={"8"} color={Colors.secondary} />
        <SummaryBox title={"Watchlist"} value={"16"} color={Colors.primary} />
      </View>
      <View style={{ height: 1, backgroundColor: "gray", marginTop: 10 }} />

      <View style={styles.favoritesContainer}>
        <AppText
          title={"Noel's Favorites"}
          style={{ fontSize: 14, alignSelf: "center", marginTop: 10 }}
        />
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
