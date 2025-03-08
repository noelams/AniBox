import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

const HeaderSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} />
        </TouchableOpacity>
        <Image
          source={require("../assets/my_picture.jpg")}
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
    marginVertical: 40,
    marginHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
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
