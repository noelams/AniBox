import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../Constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CustomTitle from "../Components/CustomTitle";
import CustomInput from "../Components/CustomInput";
import { FlatList } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../Types/navigation.types";
import { SearchSuggestionResponse } from "../Types/animedata.types";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SearchSuggestionResponse[]>(
    []
  );
  const [isLoading, setIsloading] = useState(false);
  const [emptySearchResult, setEmptySearchResult] = useState(false);

  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();

  const fetchResults = async (query: string) => {
    try {
      setIsloading(true);
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&limit=5`
      );
      const result = await response.json();
      const finalResult = result.data;

      setSuggestions(finalResult);

      if (finalResult.length === 0) {
        setEmptySearchResult(true);
      } else {
        setEmptySearchResult(false);
      }
    } catch (err) {
      console.error("Error fetching Search Results:", err);
    } finally {
      setIsloading(false);
    }
  };

  const handlePress = (item: SearchSuggestionResponse) => {
    const id = item.mal_id;
    navigation.navigate("AniDetails", { id });
    setSearchQuery("");
    setSuggestions([]);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchResults(searchQuery);
      } else {
        setSuggestions([]);
        setEmptySearchResult(false);
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

      {isLoading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="small" color="purple" />
        </View>
      )}

      {!isLoading && suggestions.length > 0 && (
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
      )}

      {!isLoading && emptySearchResult && (
        <View style={{ padding: 20 }}>
          <Text style={{ color: Colors.placeholder }}>
            No Results for "{searchQuery}"
          </Text>
        </View>
      )}
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
  suggestionList: {
    marginHorizontal: 20,
    alignSelf: "stretch",
    maxHeight: 250,
    paddingHorizontal: 10,
  },
  suggestion: {
    marginVertical: 5,
    borderBottomColor: Colors.accent4,
    borderBottomWidth: 1,
    padding: 5,
  },
  suggestionText: {
    color: Colors.placeholder,
    fontSize: 16,
  },
});

export default Search;
