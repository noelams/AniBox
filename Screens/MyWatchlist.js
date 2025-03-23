import { StyleSheet, Text, View, FlatList } from "react-native";
import WatchlistContext from "../Context/WatchlistContext";
import AniCard from "../Components/AniCard";
import React, { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "../Constants/Colors";
import AppText from "../Components/AppText";

const MyWatchlist = () => {
  const { watchlist } = useContext(WatchlistContext);
  return (
    <SafeAreaProvider style={styles.container}>
      <AppText title="Watchlist" style={styles.title} />
      <View style={styles.gridContainer}>
        {watchlist.map((item) => {
          return (
            <AniCard
              title={item?.title}
              image={item?.main_picture?.medium}
              id={item?.id}
              key={item?.id}
            />
          );
        })}
      </View>
    </SafeAreaProvider>
  );
};

export default MyWatchlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  title: {
    fontSize: 24,
    marginTop: 30,
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
