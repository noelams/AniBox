import { SafeAreaView, View, StyleSheet } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import Colors from "../Constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomTitle from "../Components/CustomTitle";
import CustomInput from "../Components/CustomInput";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const Search = () => {
  const bottomSheetRef = useRef(null);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleClosePress = () => {
    bottomSheetRef.current.close();
  };

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
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={styles.contentContainer} index={1}>
          {/* <Text>Awesome 🎉</Text> */}
        </BottomSheetView>
      </BottomSheet>
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
  searchResultContainer: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});

export default Search;
