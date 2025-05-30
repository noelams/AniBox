import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Colors from "../Constants/Colors";
import AniCard from "../Components/AniCard";
import HeaderSection from "../Components/HeaderSection";
import AniCategories from "../Components/AniCategories";

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection />
      <ScrollView style={styles.categoriesContainer}>
        {/* <AniCategories categoryTitle={"Popular Anime This Month"} /> */}
        <AniCategories categoryTitle={"Top Upcoming Anime"} />
        <AniCategories categoryTitle={"Top Airing Anime"} />
        <AniCategories categoryTitle={"Top Ranking Anime"} />
        <AniCategories categoryTitle={"Top Anime Movies"} />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  categoriesContainer: {
    flex: 1,
    width: "100% ",
  },
});

export default Home;
