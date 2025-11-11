import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from 'expo-router'; 

// ==============================
// MOCK DATA
// ==============================
const MOCK_USER = {
    name: "Kim Chaewon",
    avatarUrl:
        "https://i.pinimg.com/736x/50/a7/93/50a793644c1588c4cc74d47633f85dac.jpg",
};

const ORDER_STATUS_GRID = [
    // ⭐️ FIX: All order links now point to the MyOrders screen with a parameter set to the Label
    { label: "To Pay", icon: "wallet-outline", library: "Ionicons", route: "MyOrders" }, 
    { label: "To Ship", icon: "cube-outline", library: "Ionicons", route: "MyOrders" }, 
    { label: "To Receive", icon: "shipping-fast", library: "FontAwesome5", route: "MyOrders" },
    { label: "Return/Refunded", icon: "refresh", library: "MaterialCommunityIcons", route: "MyOrders" },
    { label: "Cancelled", icon: "close-circle-outline", library: "Ionicons", route: "MyOrders" },
    { label: "Completed", icon: "receipt-outline", library: "Ionicons", route: "MyOrders" },
    { label: "Wishlist", icon: "heart", library: "FontAwesome", route: "Wishlist" },
    { label: "Support", icon: "headset-outline", library: "Ionicons", route: "CustomerSupport" }, // Using ContactUs route
];

const MENU_LINKS = [
    { label: "Edit Profile", icon: "person-outline", library: "Ionicons", route: "EditProfile" }, 
    { label: "Edit Shipping Address", icon: "location-outline", library: "Ionicons", route: "Address" }, 
    { label: "Contact Us", icon: "mail-outline", library: "Ionicons", route: "contactus" },
];

// ==============================
// REUSABLE COMPONENTS
// ==============================
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

const StatusIcon = ({ label, icon, library, route }: any) => {
    const IconComponent = getIconComponent(library);
    const router = useRouter(); 
    
    const handlePress = () => {
        // If the route is 'MyOrders', pass the label as the activeTab parameter
        if (route === "MyOrders") {
            router.push({
                pathname: "/MyOrders", 
                params: { activeTab: label } // Passes "To Pay", "To Ship", "Completed", etc.
            });
        } 
        else if (route) {
             // For standard routes (Wishlist, EditProfile)
             router.push(route); 
        } else {
            console.log(`Tapped ${label}`);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} className="w-1/4 items-center py-4">
            <IconComponent
                name={icon}
                size={28}
                color={label === "Wishlist" ? "#dc2626" : "#1A1A1A"}
            />
            <Text 
                className={`text-sm text-gray-600 mt-1 text-center ${
                    label === "Return/Refunded" ? "text-xs leading-4" : ""
                }`}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const MenuLink = ({ label, icon, library, route }: any) => {
    const IconComponent = getIconComponent(library);
    const router = useRouter(); 

    return (
        <TouchableOpacity
            className="flex-row items-center justify-between bg-white py-[18px] px-4 border-b border-gray-100 last:border-b-0"
            onPress={() => router.push(route)} 
        >
            <View className="flex-row items-center">
                <IconComponent
                    name={icon}
                    size={22}
                    color="#1A1A1A"
                    style={{ marginRight: 12 }}
                />
                <Text className="text-[17px] text-[#1a1a1a] font-medium">{label}</Text>
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

    // Calculate dynamic top padding for Android/iOS status bar spacing
    const androidPaddingTop = (StatusBar.currentHeight || 20) + 10;
    const iosPaddingTop = 44 + 10;
    const HEADER_PADDING_TOP = Platform.OS === "android" ? androidPaddingTop : iosPaddingTop;


    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" backgroundColor="#2E2F2A" />

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* ============================== HEADER ============================== */}
                <View>
                    {/* Dark Header Bar */}
                    <View 
                        style={{ paddingTop: HEADER_PADDING_TOP }}
                        className="bg-[#2E2F2A] px-4 pb-[18px]"
                    >
                        <Text className="text-4xl font-extrabold text-white leading-[50px]">Cliftunes</Text>
                    </View>

                    {/* Profile Info Section */}
                    <View className="flex-row items-center bg-white px-4 py-3 border-b border-gray-200">
                        <View className="relative mr-3">
                            <Image
                                source={{ uri: MOCK_USER.avatarUrl }}
                                className="w-20 h-20 rounded-full"
                            />
                            {/* Camera Overlay */}
                           
                        </View>
                        <Text className="text-xl font-bold text-black">{MOCK_USER.name}</Text>
                    </View>
                </View>

                {/* ============================== MY ORDERS ============================== */}
                <View className="bg-white mt-3 mx-4 rounded-xl shadow-md">
                    <Text className="text-lg font-bold text-black p-4 border-b border-gray-100">
                        My Orders
                    </Text>
                    <View className="flex-row flex-wrap p-2">
                        {ORDER_STATUS_GRID.map((item, index) => (
                            <StatusIcon
                                key={index}
                                label={item.label}
                                icon={item.icon}
                                library={item.library}
                                route={item.route}
                            />
                        ))}
                    </View>
                </View>

                {/* ============================== MENU LINKS ============================== */}
                <View className="mt-3 mx-4 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md">
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
            <View className="absolute bottom-5 left-5 right-5">
                <TouchableOpacity onPress={handleLogout} className="bg-red-600 p-3 rounded-xl flex-row justify-center items-center shadow-lg">
                    <Feather
                        name="log-out"
                        size={20}
                        color="#fff"
                        style={{ marginRight: 8 }}
                    />
                    <Text className="text-white text-base font-bold">Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}