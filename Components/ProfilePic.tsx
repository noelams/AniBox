import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ProfilePicProps } from "../Types/ui.types";

const ProfilePic = ({ image, onEdit, displayName }: ProfilePicProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.profilePicContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={20}
            color={"white"}
          />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: image
                ? image
                : "https://ui-avatars.com/api/?name=Noel+Inalegwu",
            }}
            style={styles.image}
          />
        </View>
      </View>
      <Text style={styles.displayName}>{displayName}</Text>
    </View>
  );
};

export default ProfilePic;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  profilePicContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: Colors.placeholder,
    alignSelf: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    position: "absolute",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  editButton: {
    position: "relative",
    left: 60,
    backgroundColor: Colors.backgroundColor,
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  displayName: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#ffffff",
  },
});
