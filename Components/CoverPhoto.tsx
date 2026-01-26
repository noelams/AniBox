import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import ProfilePic from "./ProfilePic";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Colors from "../Constants/Colors";
import { CoverPhotoProps } from "../Types/ui.types";

const CoverPhoto = ({
  onChangeCover,
  coverImage,
  onChangeProfile,
  profileImage,
  displayName,
}: CoverPhotoProps) => {
  return (
    <View style={{ marginBottom: 50 }}>
      <Image
        source={{
          uri: coverImage
            ? coverImage
            : "https://ui-avatars.com/api/?name=Noel+Inalegwu",
        }}
        style={styles.coverImage}
      />
      <TouchableOpacity onPress={onChangeCover} style={styles.editCoverButton}>
        <MaterialCommunityIcons
          name="pencil-outline"
          size={24}
          color={Colors.backgroundColor}
        />
      </TouchableOpacity>
      <View style={styles.profilePicContainer}>
        <ProfilePic
          onEdit={onChangeProfile}
          image={profileImage}
          displayName={displayName}
        />
      </View>
    </View>
  );
};

export default CoverPhoto;

const styles = StyleSheet.create({
  coverImage: {
    position: "absolute",
    width: "100%",
    height: 200,
  },
  profilePicContainer: {
    position: "relative",
    bottom: -100,
  },
  editCoverButton: {
    alignSelf: "flex-end",
    marginRight: 10,
    marginTop: 10,
    padding: 10,
  },
});
