import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "../Constants/Colors";
import { ErrorScreenProps } from "../Types/screen.types";

const ErrorScreen = ({
  onRetry,
  onGoBack,
  screenName,
  errorMessage = "Something went wrong while loading this screen.",
  showGoBack = true,
}: ErrorScreenProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.errorIcon}>
        <Text style={styles.iconText}>⚠️</Text>
      </View>

      <Text style={styles.title}>Oops!</Text>

      <Text style={styles.errorText}>
        {screenName ? `Error loading ${screenName}` : errorMessage}
      </Text>

      <Text style={styles.subText}>
        Please check your connection and try again.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>

        {showGoBack && onGoBack && (
          <TouchableOpacity style={styles.goBackButton} onPress={onGoBack}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 20,
  },
  errorIcon: {
    marginBottom: 20,
  },
  iconText: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textColor || "#333",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textColor,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "500",
  },
  subText: {
    fontSize: 14,
    color: Colors.subtextColor,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  retryButton: {
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  goBackButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  goBackButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
