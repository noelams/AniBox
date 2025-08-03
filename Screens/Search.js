import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Colors from "../Constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomTitle from "../Components/CustomTitle";
import CustomInput from "../Components/CustomInput";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsloading] = useState(false);

  const fetchResults = async (searchQuery) => {
    try {
      setIsloading(true);
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${searchQuery}&limit=5`
      );
      const result = await response.json();

      setSuggestions(result.data);
      // console.log("result:", result.data);
    } catch (err) {
      console.error("Error fetching Search Results:", err);
    } finally {
      setIsloading(false);
    }
  };

  const handlePress = (item) => {
    const id = item.mal_id;
    console.log("Suggestion:", item);
    navigation.navigate("Home", { screen: "AniDetails", params: { id: id } });
    setSearchQuery("");
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchResults(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);
  return (
    <SafeAreaView style={styles.container}>
      <CustomTitle title="Search" />
      <CustomInput
        value={searchQuery}
        returnKeyLabel={"Search"}
        placeholder={"Search for your favorite Anime"}
        icon={
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color={Colors.backgroundColor}
          />
        }
        customInputContainerStyle={styles.searchInput}
        onChangeText={(text) => setSearchQuery(text)}
      />
      {suggestions?.length > 0 &&
        (isLoading ? (
          <ActivityIndicator size={"small"} color={"purple"} />
        ) : (
          <FlatList
            scrollEnabled={false}
            style={styles.suggestionList}
            data={suggestions}
            keyExtractor={(item) => item.mal_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePress(item)}
                style={styles.suggestion}
              >
                <Text style={styles.suggestionText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        ))}
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
  suggestionList: {
    marginHorizontal: 20,
    backgroundColor: "white",
    alignSelf: "stretch",
    borderRadius: 8,
    maxHeight: 250,
    paddingHorizontal: 10,
  },
  suggestion: {
    marginVertical: 5,
    borderBottomColor: Colors.accent4,
    borderBottomWidth: 1,
    padding: 5,
  },
});

export default Search;
