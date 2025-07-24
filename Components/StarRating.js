import { StyleSheet, Pressable, View } from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const StarRating = ({ onRatingChange, maxStars = 5, rating = 0 }) => {
  const [currentRating, setCurrentRating] = useState(rating);

  const handleRatingChange = (event, index) => {
    const locationX = event.nativeEvent.locationX;
    const startWidth = 60;
    const isHalf = locationX < startWidth / 2;
    const newRating = isHalf ? index + 0.5 : index + 1;
    setCurrentRating(newRating);
    onRatingChange && onRatingChange(newRating);
  };

  const getStarType = (index) => {
    if (currentRating >= index + 1) return "star";
    if (currentRating >= index + 0.5) return "star-half";
    return "star-outline";
  };
  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, index) => (
        <Pressable
          key={index}
          onPressIn={(event) => handleRatingChange(event, index)}
        >
          <MaterialIcons name={getStarType(index)} size={60} color={"gold"} />
        </Pressable>
      ))}
    </View>
  );
};

export default StarRating;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
});
