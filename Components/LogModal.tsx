import {
  Image,
  Modal,
  TextInput,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import BackButton from "./BackButton";
import AppText from "./AppText";
import Colors from "../Constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusButton from "./StatusButton";
import { Rating } from "react-native-ratings";
import CustomButton from "./CustomButton";
import { useEffect } from "react";

const LogModal = ({
  modalIsVisible,
  setModalIsVisible,
  title,
  main_picture,
  start_date,
  logData,
  setLogData,
  hasLog,
  onSubmit,
  isLoading = false,
}) => {
  // Initialize/sync form when modal opens
  useEffect(() => {
    if (modalIsVisible) {
      if (!hasLog) {
        // Reset form for new log
        setLogData({
          review: "",
          status: null,
          score: 0,
          hasFavorite: logData.hasFavorite || false,
        });
      }
      // For existing logs, logData is already synced from AniDetails
    }
  }, [modalIsVisible, hasLog, logData.hasFavorite, setLogData]);
  return (
    <Modal visible={modalIsVisible} transparent={true} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <BackButton onPress={() => setModalIsVisible(false)} />
          <AppText title="Write Your Review" style={{ fontSize: 16 }} />
        </View>
        <View style={styles.modalImageContainer}>
          <View style={{ flex: 1 }}>
            <View style={[styles.titleContainer]}>
              <AppText
                title={title}
                style={[styles.title, { fontSize: 16, maxWidth: "50%" }]}
                numberOfLines={3}
              />
              <AppText
                title={start_date?.split("-")[0]}
                style={styles.startDate}
              />
            </View>
            <View style={styles.logStatusContainer}>
              <StatusButton
                iconName={logData.status === "watched" ? "eye" : "eye-outline"}
                label={"Seen"}
                onPress={() =>
                  setLogData((prev) => ({
                    ...prev,
                    status: "watched",
                  }))
                }
                disabled={isLoading}
              />
              <StatusButton
                iconName={
                  logData.status === "want to watch" ? "pin" : "pin-outline"
                }
                label={"Watchlist"}
                onPress={() =>
                  setLogData((prev) => ({
                    ...prev,
                    status: "want to watch",
                  }))
                }
                disabled={isLoading}
              />
              <StatusButton
                iconName={
                  logData.status === "watching"
                    ? "play-circle"
                    : "play-circle-outline"
                }
                label={"Watching"}
                onPress={() =>
                  setLogData((prev) => ({
                    ...prev,
                    status: "watching",
                  }))
                }
                disabled={isLoading}
              />
            </View>
            <View style={styles.modalRatingContainer}>
              <AppText
                title="Give Your Rating"
                style={styles.modalRatingText}
              />
              <Rating
                key={`rating-${logData.score}`}
                tintColor={Colors.backgroundColor}
                minValue={0.5}
                fractions={1}
                jumpValue={0.5}
                type="star"
                ratingCount={5}
                startingValue={logData.score || 0}
                onFinishRating={(rating: number) => {
                  setLogData((prev) => ({
                    ...prev,
                    score: rating,
                  }));
                }}
              />
            </View>
          </View>
          <Image
            source={{ uri: main_picture?.medium }}
            style={styles.modalImg}
          />
        </View>
        <View style={styles.reviewInputContainer}>
          <TextInput
            editable={!isLoading}
            scrollEnabled
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
            placeholder="Write your review here..."
            placeholderTextColor="#666"
            style={[styles.textInput, { opacity: isLoading ? 0.6 : 1 }]}
            value={logData.review}
            onChangeText={(text) =>
              setLogData((prev) => ({ ...prev, review: text }))
            }
          />
        </View>
        <CustomButton
          title={isLoading ? "Publishing..." : "Publish Log"}
          onPress={onSubmit}
          disabled={isLoading}
          customStyles={{
            backgroundColor: isLoading ? Colors.placeholder : Colors.secondary,
            marginBottom: 20,
            width: "50%",
            opacity: isLoading ? 0.6 : 1,
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  //modal styles
  titleContainer: {
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    maxWidth: "75%",
    color: "white",
  },
  modal: {
    borderWidth: 1,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  modalContainer: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    borderColor: Colors.accent2,
    paddingBottom: 80,
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  modalImageContainer: {
    flexDirection: "row",
    width: "100%",
    height: 200,
  },
  modalImg: {
    width: 150,
    height: "100%",
    borderRadius: 10,
  },

  reviewInputContainer: {
    minHeight: 120,
    marginHorizontal: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  textInput: {
    padding: 12,
    color: "#fff",
    fontSize: 14,
    height: 350,
    backgroundColor: "#3D3B54",
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.accent2,
    margin: 10,
  },
  logStatusContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginVertical: 10,
    marginTop: 20,
  },
  modalRatingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalRatingText: {
    color: "#ffffff",
    fontSize: 12,
    alignSelf: "flex-start",
  },
  inputContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: Colors.placeholder,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.accent3,
  },
  startDate: {
    marginLeft: 5,
    fontSize: 10,
  },
  saveButton: {
    width: "100%",
  },
});

export default LogModal;
