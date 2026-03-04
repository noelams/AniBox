import {
  View,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { HeaderSectionProps } from "../Types/ui.types";
import AppText from "./AppText";
import Colors from "../Constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { SideDrawerParamList } from "../Types/navigation.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HeaderSection = ({ profileImage, profileName }: HeaderSectionProps) => {
  const navigation = useNavigation<DrawerNavigationProp<SideDrawerParamList>>();
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{ padding: 10 }}
        >
          <MaterialCommunityIcons name="menu" size={28} />
        </TouchableOpacity>

        <AppText
          title={`Hello, ${profileName}`}
          style={{ fontSize: 24, color: Colors.primary, fontWeight: "bold" }}
        />
        <Image
          source={{
            uri: profileImage
              ? profileImage
              : "https://ui-avatars.com/api/?name=Noel+Inalegwu",
          }}
          style={styles.coverPhoto}
        />
      </View>
    </View>
  );
};

export default HeaderSection;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
