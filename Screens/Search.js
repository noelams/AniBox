import { SafeAreaView, View, StyleSheet } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomTitle from "../Components/CustomTitle";
import CustomInput from "../Components/CustomInput";

const Search = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CustomTitle title="Search" />
      <CustomInput
        placeholder={"Search for your favorite Anime"}
        icon={
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={Colors.backgroundColor}
          />
        }
        customInputContainerStyle={styles.searchInput}
      />

      <View style={styles.searchResultContainer}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: 20,
  },
  searchInput: {
    backgroundColor: Colors.accent4,
    marginHorizontal: 20,
    borderRadius: 10,
  },
});

export default Search;
