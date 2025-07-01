import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTitle from "./CustomTitle";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import Colors from "../Constants/Colors";

const AuthForm = ({
  title,
  subTitle,
  fields,
  onSubmit,
  navigation,
  alternateText,
  alternateActionLabel,
  alternateActionTarget,
  image,
}) => {
  const [formData, setFormData] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const emptyField = Object.entries(formData).find(
      ([key, value]) => !value.trim()
    );

    if (emptyField) {
      Alert.alert("Missing Field", `Please fill in your ${emptyField[0]}`);
      return;
    }
    if (
      formData.password !== formData.confirmPassword &&
      formData.confirmPassword !== undefined
    ) {
      Alert.alert("Password Mismatch", "Please ensure your passwords match", [
        { text: "OK" },
      ]);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.appContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.imageContainer}>
              <Image source={image} style={styles.imageStyles} />
            </View>
            <View style={styles.container}>
              <CustomTitle title={title} subTitle={subTitle} />
              {fields.map((field) => (
                <CustomInput
                  key={field.name}
                  icon={field.icon}
                  placeholder={field.placeholder}
                  isPassword={field.isPassword}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, [field.name]: text }))
                  }
                />
              ))}
              <CustomButton
                title={loading ? <ActivityIndicator /> : title}
                onPress={handleSubmit}
                disabled={loading}
              />
              <View style={styles.CTAcontainer}>
                <Text style={styles.CTAtext}>{alternateText} </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(alternateActionTarget)}
                >
                  <Text style={styles.goToAction}>{alternateActionLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  imageContainer: {
    height: 350,
  },
  imageStyles: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    paddingHorizontal: 40,
    flex: 1,
    justifyContent: "center",
  },
  CTAcontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
  CTAtext: {
    color: Colors.secondary,
  },
  goToAction: {
    color: Colors.accent3,
    fontWeight: "bold",
  },
});
