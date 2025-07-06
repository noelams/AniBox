import { SafeAreaView, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Search = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CUstomTitle title="Search" />
      <CustomInput
        placeholder={"Search for your favorite Anime"}
        icon={<MaterialCommunityIcons name="search" size={16} />}
        customInputContainerStyle={styles.searchInput}
      />

      <View style={styles.searchResultContainer}> </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  searchInput: {
    backgroundColor: Colors.accent4,
  },
});

export default Search;
