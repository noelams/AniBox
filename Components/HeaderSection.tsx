import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { HeaderSectionProps } from "../Types/ui.types";
import AppText from "./AppText";
import Colors from "../Constants/Colors";

const HeaderSection = ({ profileImage, profileName }: HeaderSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <AppText
          title={`Hello, ${profileName}`}
          style={{ fontSize: 24, color: Colors.primary, fontWeight: "bold" }}
        />
        <Image
          source={{
            uri: profileImage
              ? profileImage
              : "https://ui-avatars.com/api/?name=Noel+Inalegwu",
          }}
          style={styles.coverPhoto}
        />
      </View>
    </View>
  );
};

export default HeaderSection;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
