import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ==============================
// MOCK DATA
// ==============================
const MOCK_USER = {
  name: "Kim Chaewon",
  avatarUrl:
    "https://i.pinimg.com/736x/50/a7/93/50a793644c1588c4cc74d47633f85dac.jpg",
};

const ORDER_STATUS_GRID = [
  { label: "To Pay", icon: "wallet-outline", library: "Ionicons" },
  { label: "To Ship", icon: "cube-outline", library: "Ionicons" },
  { label: "To Deliver", icon: "shipping-fast", library: "FontAwesome5" },
  { label: "To Rate", icon: "star-outline", library: "Ionicons" },
  { label: "Cancelled", icon: "close-circle-outline", library: "Ionicons" },
  { label: "Order History", icon: "receipt-outline", library: "Ionicons" },
  { label: "Wishlist", icon: "heart", library: "FontAwesome" },
  { label: "Support", icon: "headset-outline", library: "Ionicons" },
];

const MENU_LINKS = [
  { label: "Edit Profile", icon: "person-outline", library: "Ionicons", route: "EditProfile" },
  { label: "Edit Shipping Address", icon: "location-outline", library: "Ionicons", route: "EditShippingAddress" },
  { label: "Contact Us", icon: "mail-outline", library: "Ionicons", route: "ContactUs" },
];

const getIconComponent = (library: string): React.ComponentType<any> => {
  switch (library) {
    case "FontAwesome5":
      return FontAwesome5;
    case "Feather":
      return Feather;
    case "MaterialIcons":
      return MaterialIcons;
    case "FontAwesome":
      return FontAwesome;
    default:
      
      return Ionicons;
  }
};

// ==============================
// REUSABLE COMPONENTS
// ==============================
const StatusIcon = ({ label, icon, library }: any) => {
  const IconComponent = getIconComponent(library);
  return (
    <TouchableOpacity style={styles.statusIconContainer}>
      <IconComponent
        name={icon}
        size={28}
        color={label === "Wishlist" ? "#dc2626" : "#1A1A1A"}
      />
      <Text style={styles.statusIconLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const MenuLink = ({ label, icon, library, route }: any) => {
  const IconComponent = getIconComponent(library);
  return (
    <TouchableOpacity
      style={styles.menuLinkContainer}
      // TODO: navigation.navigate(route)
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconComponent
          name={icon}
          size={22}
          color="#1A1A1A"
          style={{ marginRight: 12 }}
        />
        <Text style={styles.menuLinkLabel}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={22} color="#9ca3af" />
    </TouchableOpacity>
  );
};

// ==============================
// MAIN COMPONENT
// ==============================
export default function Profile() {
  const handleLogout = () => {
    // TODO: Add backend logout logic
    console.log("User logged out");
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2E2F2A" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ============================== HEADER ============================== */}
        <View>
          <View style={styles.darkHeaderBar}>
            <Text style={styles.headerTitle}>Clifton</Text>
            <Text style={styles.headerTitle}>Guitars</Text>
          </View>

          {/* Light gray user section under header */}
          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: MOCK_USER.avatarUrl }}
                style={styles.avatarImage}
              />
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera-outline" size={12} color="#2E2F2A" />
              </View>
            </View>
            <Text style={styles.usernameText}>{MOCK_USER.name}</Text>
          </View>
        </View>

        {/* ============================== MY ORDERS ============================== */}
        <View style={styles.myOrdersSection}>
          <Text style={styles.myOrdersTitle}>My Orders</Text>
          <View style={styles.ordersGrid}>
            {ORDER_STATUS_GRID.map((item, index) => (
              <StatusIcon
                key={index}
                label={item.label}
                icon={item.icon}
                library={item.library}
              />
            ))}
          </View>
        </View>

        {/* ============================== MENU LINKS ============================== */}
        <View style={styles.menuLinksWrapper}>
          {MENU_LINKS.map((link, index) => (
            <MenuLink
              key={index}
              label={link.label}
              icon={link.icon}
              library={link.library}
              route={link.route}
            />
          ))}
        </View>
      </ScrollView>

      {/* ============================== LOGOUT ============================== */}
      <View style={styles.logoutButtonWrapper}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather
            name="log-out"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // --- HEADER ---
  darkHeaderBar: {
    backgroundColor: "#2E2F2A",
    paddingHorizontal: 16,
    paddingTop:
      (Platform.OS === "android" ? StatusBar.currentHeight || 20 : 44) + 10,
    paddingBottom: 18,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "white",
    lineHeight: 34,
  },

  // --- PROFILE INFO (Light gray section) ---
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 41,
  },
  cameraOverlay: {
    position: "absolute",
    right: -2,
    bottom: -2,
    padding: 4,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  // --- ORDERS ---
  myOrdersSection: {
    backgroundColor: "white",
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  myOrdersTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  ordersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  statusIconContainer: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 16,
  },
  statusIconLabel: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },

  // --- MENU LINKS ---
  menuLinksWrapper: {
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "white",
  },
  menuLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  menuLinkLabel: {
    fontSize: 17,
    color: "#1a1a1a",
    fontWeight: "500",
  },

  // --- LOGOUT BUTTON ---
  logoutButtonWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
