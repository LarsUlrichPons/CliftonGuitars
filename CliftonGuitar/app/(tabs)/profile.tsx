import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Mock User ---
const MOCK_USER = {
  name: "Kim Chaewon",
  avatarUrl:
    "https://i.pinimg.com/736x/50/a7/93/50a793644c1588c4cc74d47633f85dac.jpg",
};

// --- Icon Chooser Helper ---
const getIconComponent = (library: string) => {
  switch (library) {
    case "FontAwesome5":
      return FontAwesome5;
    case "MaterialIcons":
      return MaterialIcons;
    case "Feather":
      return Feather;
    default:
      return Ionicons;
  }
};

// --- Data ---
const ORDER_STATUS_GRID = [
  { label: "To Pay", icon: "wallet-outline", library: "Ionicons" },
  { label: "To Ship", icon: "package", library: "Feather" },
  { label: "To Receive", icon: "shipping-fast", library: "FontAwesome5" },
  { label: "To Rate", icon: "star-outline", library: "Ionicons" },
  { label: "Cancelled", icon: "x-circle", library: "Feather" },
  { label: "Order History", icon: "history", library: "MaterialIcons" },
  { label: "Wishlist", icon: "heart", library: "Feather" },
  { label: "Contact Us", icon: "mail-outline", library: "Ionicons" },
];

const MENU_LINKS = [
  { label: "Edit Profile", icon: "user", library: "Feather", route: "edit-profile" },
  { label: "Edit Shipping Address", icon: "map-pin", library: "Feather", route: "edit-address" },
  // Removed Settings
];

// --- Components ---
const StatusIcon = ({
  label,
  icon,
  library,
}: {
  label: string;
  icon: string;
  library: string;
}) => {
  const IconComponent = getIconComponent(library);

  return (
    <TouchableOpacity className="w-1/4 items-center p-2 mb-2">
      <View className="p-3 rounded-xl mb-1 items-center justify-center">
        <IconComponent name={icon as any} size={28} color="#2E2F2A" />
      </View>
      <Text className="text-xs text-gray-700 text-center">{label}</Text>
    </TouchableOpacity>
  );
};

const MenuLink = ({
  label,
  icon,
  library,
  route,
}: {
  label: string;
  icon: string;
  library: string;
  route: string;
}) => {
  const IconComponent = getIconComponent(library);

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between bg-white p-5 border-b border-gray-100"
      onPress={() => console.log(`Navigating to ${route}`)} // replace with navigation.navigate(route)
    >
      <View className="flex-row items-center">
        <IconComponent
          name={icon as any}
          size={26}
          color="#2E2F2A"
          style={{ marginRight: 14 }}
        />
        <Text className="text-lg font-semibold text-[#1a1a1a]">{label}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );
};

// --- Main Profile Screen ---
const Profile = () => {
  const handleLogout = () => router.replace('/login');

  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={["left", "right", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#2E2F2A" />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="bg-white pb-6 border-b border-gray-200 shadow-sm">
          <View className="bg-[#2E2F2A] p-4 pt-12">
            <Text className="text-3xl font-extrabold text-white">Clifton</Text>
            <Text className="text-4xl font-extrabold text-white">Guitars</Text>
          </View>

          <View className="flex-row items-center p-4">
            <View className="relative mr-4">
              <Image
                source={{ uri: MOCK_USER.avatarUrl }}
                className="w-20 h-20 rounded-full border-2 border-white"
                style={styles.avatarShadow}
              />
              <View className="absolute bottom-0 right-0 p-[3px] rounded-full bg-white border border-gray-300">
                <Ionicons name="camera-outline" size={12} color="#2E2F2A" />
              </View>
            </View>
            <Text className="text-2xl font-bold text-[#1a1a1a]">{MOCK_USER.name}</Text>
          </View>
        </View>

        {/* My Orders */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-md p-4">
          <Text className="text-lg font-bold text-[#1a1a1a] mb-4">My Orders</Text>
          <View className="flex-row flex-wrap justify-start">
            {ORDER_STATUS_GRID.map((item) => (
              <StatusIcon
                key={item.label}
                label={item.label}
                icon={item.icon}
                library={item.library}
              />
            ))}
          </View>
        </View>

        {/* Menu Links */}
        <View className="mt-4 mx-4 rounded-xl overflow-hidden shadow-md">
          {MENU_LINKS.map((link) => (
            <MenuLink
              key={link.label}
              label={link.label}
              icon={link.icon}
              library={link.library}
              route={link.route}
            />
          ))}
        </View>
      </ScrollView>

      {/* Logout Button */}
      <View className="absolute bottom-4 left-4 right-4">
        <TouchableOpacity
          className="bg-red-600 p-4 rounded-xl items-center shadow-lg flex-row justify-center"
          onPress={handleLogout}
        >
          <Feather name="log-out" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text className="text-lg font-bold text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  avatarShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Profile;
