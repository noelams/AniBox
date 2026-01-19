import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import ConfirmModal from "../Components/ConfirmModal";
import UserContext from "../Context/UserContext";
import CustomButton from "../Components/CustomButton";
import Colors from "../Constants/Colors";

const Settings = () => {
  const { signOut } = useContext(UserContext);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <CustomButton title="Log Out" onPress={() => setModalIsVisible(true)} />
      <ConfirmModal
        visible={modalIsVisible}
        onClose={() => setModalIsVisible(false)}
        onConfirm={() => signOut()}
        buttonLabel="Log Out"
        message="Are you sure you want to log out?"
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: "center",
  },
});
