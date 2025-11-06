import BestSellerDropdown from "@/components/DropDown";
import SearchBar from "@/components/searchbar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

// ==============================
// MOCK DATA (for display)
// ==============================
const mockProducts = [
  {
    id: 1,
    name: "Clifton Vintage Custom Telecaster Electric Guitar",
    category: "Electric Guitar",
    price: 6950,
    image:
      "https://placehold.co/300x300/1C1C1C/FFFFFF?text=Electric+Guitar",
  },
  {
    id: 2,
    name: "Roadhouse Bass Pro",
    category: "Bass Guitar",
    price: 7500,
    image:
      "https://placehold.co/300x300/3C3C3C/FFFFFF?text=Bass+Guitar",
  },
  {
    id: 3,
    name: "Clifton Acoustic Dreadnought",
    category: "Acoustic Guitar",
    price: 5200,
    image:
      "https://placehold.co/300x300/6D7260/FFFFFF?text=Acoustic+Guitar",
  },
];

const CATEGORY_PILLS = [
  "All Products",
  "Bass Guitar",
  "Electric Guitar",
  "Acoustic Guitar",
  "Basta",
];

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialCategory = (params.category as string) || "Bass Guitar";
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [searchText, setSearchText] = React.useState("");

  // Filtered products
  const filteredProducts = mockProducts.filter((product) => {
    const matchCategory = product.category === selectedCategory;
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleBack = () => router.back();

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ================= HEADER ================= */}
      <View
        className="bg-white w-full border-b border-gray-200"
        style={{
          paddingTop:
            Platform.OS === "android"
              ? (StatusBar.currentHeight || 40) + 10
              : 60,
          paddingBottom: 10,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBack}
          className="absolute left-4 z-10"
          style={{
            top:
              Platform.OS === "android"
                ? (StatusBar.currentHeight || 40) + 10
                : 64,
          }}
        >
          <Ionicons name="arrow-back" size={26} color="#1a1a1a" />
        </TouchableOpacity>

        {/* Center Title */}
        <Text className="text-2xl font-extrabold text-[#2E2F2A] text-center">
          CATEGORIES
        </Text>

        {/* Search Bar */}
        <View className="mt-4 px-4">
          <SearchBar
            
          />
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 px-4"
          contentContainerStyle={{ gap: 12 }}
        >
          {CATEGORY_PILLS.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === category
                  ? "border-[#FF9500] bg-[#FFF4E5]"
                  : "border-gray-300 bg-transparent"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedCategory === category
                    ? "text-[#FF9500]"
                    : "text-gray-700"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ================= PRODUCT LIST ================= */}
      <ScrollView className="flex-1">
        {/* Section Title */}
        <View className="px-4 mb-5">
            <BestSellerDropdown />
          </View>

        {/* Product Grid */}
        <View className="flex-row flex-wrap justify-start px-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="w-[48%] mb-6 bg-white rounded-xl overflow-hidden shadow"
                onPress={() =>
                    router.push({
                      pathname: "/products_detail",
                      params: {
                        id: product.id.toString(),
                        name: product.name,
                        price: product.price.toString(),
                        imageUrl: product.image,
                        category: product.category,
                      },
                    })
                  }
                                >
                {/* Product Image */}
                <View className="h-40 w-full items-center justify-center bg-white relative">
                  <Image
                    source={{ uri: product.image }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                 
                </View>

                {/* Product Info */}
                <View className="p-3">
                  <Text
                    className="text-xs text-gray-800 mb-1 leading-4"
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>
                  <Text className="text-base font-extrabold text-[#FF9500]">
                    ₱{product.price.toLocaleString("en-US")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="w-full items-center justify-center py-16">
              <Text className="text-lg font-medium text-gray-500">
                No products found.
              </Text>
              <Text className="text-sm text-gray-400 mt-2">
                Try searching or switching categories.
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Padding */}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
