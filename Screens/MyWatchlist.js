import { StyleSheet, Text, View, FlatList } from "react-native";
import WatchlistContext from "../Context/WatchlistContext";
import AniCard from "../Components/AniCard";
import React, { useContext } from "react";

const MyWatchlist = () => {
  const { watchlist } = useContext(WatchlistContext);
  return (
    <View>
      <Text>My Watchlist</Text>
      <FlatList
        data={watchlist}
        keyExtractor={(item) => item?.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <AniCard
              title={item?.title}
              image={item?.main_picture?.medium}
              id={item?.id}
            />
          );
        }}
      />
    </View>
  );
};

export default MyWatchlist;

const styles = StyleSheet.create({});
