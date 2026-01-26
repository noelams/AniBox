import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { HeaderSectionProps } from "../Types/ui.types";

const HeaderSection = ({ profileImage }: HeaderSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
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
    justifyContent: "flex-end",
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
