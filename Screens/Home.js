import {
  View,
  Modal,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import Colors from "../Constants/Colors";
import AniCard from "../Components/AniCard";
import HeaderSection from "../Components/HeaderSection";
import AniCategories from "../Components/AniCategories";
import { AuthContext } from "../Context/AuthContext";
import UserContext from "../Context/UserContext";
import ConfirmModal from "../Components/ConfirmModal";

const Home = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { signOut } = useContext(AuthContext);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    console.log("user Info:", userInfo);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderSection profileImage={userInfo.profileImage} />
      <ScrollView style={styles.categoriesContainer}>
        <AniCategories categoryTitle={"Top Upcoming Anime"} />
        <AniCategories categoryTitle={"Top Airing Anime"} />
        <AniCategories categoryTitle={"Top Ranking Anime"} />
        <AniCategories categoryTitle={"Top Anime Movies"} />
        <Button
          title="Log Out"
          onPress={() => {
            setModalVisible(true);
          }}
        />
        <ConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={() => signOut()}
          message="Are you sure you want to log out?"
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
