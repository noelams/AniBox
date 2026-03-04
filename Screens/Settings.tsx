import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import ConfirmModal from "../Components/ConfirmModal";
import UserContext from "../Context/UserContext";
import CustomButton from "../Components/CustomButton";
import Colors from "../Constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { SideDrawerParamList } from "../Types/navigation.types";

const Settings = () => {
  const { signOut } = useContext(UserContext);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const navigation = useNavigation<DrawerNavigationProp<SideDrawerParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
        style={{ padding: 10 }}
      >
        <MaterialCommunityIcons name="menu" size={14} />
      </TouchableOpacity>
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
