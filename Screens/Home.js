import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import Colors from "../Constants/Colors";
import AniCard from "../Components/AniCard";
import HeaderSection from "../Components/HeaderSection";
import AniCategories from "../Components/AniCategories";
import { AuthContext } from "../Context/AuthContext";

const Home = ({ navigation }) => {
  const { signOut } = useContext(AuthContext);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection />
      <ScrollView style={styles.categoriesContainer}>
        <AniCategories categoryTitle={"Top Upcoming Anime"} />
        <AniCategories categoryTitle={"Top Airing Anime"} />
        <AniCategories categoryTitle={"Top Ranking Anime"} />
        <AniCategories categoryTitle={"Top Anime Movies"} />
        <Button
          title="Log Out"
          onPress={() => {
            signOut();
          }}
        />
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
