import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import HomeStack from "./HomeStack";
import Settings from "../Screens/Settings";
import Colors from "../Constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import ConfirmModal from "../Components/ConfirmModal";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

function CustomDrawerContent(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { signOut } = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View>
        <DrawerItem
          label="Log out"
          onPress={() => setModalVisible(true)}
          icon={({ color }) => (
            <MaterialCommunityIcons name="power" size={24} color={color} />
          )}
          pressOpacity={0.6}
          inactiveTintColor="#8F8E9A"
        />
        <ConfirmModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={() => signOut()}
          buttonLabel="Log Out"
          message="Are you sure you want to log out?"
        />
      </View>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const SideDrawer = () => {
  return (
    <Drawer.Navigator
      id={undefined}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: Colors.backgroundColor },
        drawerLabelStyle: { color: "white" },
        drawerActiveTintColor: "#E9A6A6",
        drawerInactiveTintColor: "#8F8E9A",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="home"
        component={HomeStack}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerActiveTintColor: Colors.secondary,
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default SideDrawer;
