import Categories from "@/components/Categories";
import BestSellerDropdown from "@/components/DropDown";
import SearchBar from "@/components/searchbar";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

const handleCategoryPress = (category: string) => {
  router.push({
    pathname: "/products",
    params: { category: category === "All" ? "" : category },
  });
};

  return (
   <ScrollView className="flex-1 bg-white">
  {/* Header Section */}
  <View className="bg-[#2E2F2A] pt-16 pb-6 px-4">
    <Text className="text-white text-3xl font-extrabold leading-tight">
      NO FRILLS{"\n"}JUST TONE
    </Text>
    <SearchBar />
  </View>

  <Text className="text-4xl font-extrabold text-center mt-6 text-[#1a1a1a]">
    CATALOG
  </Text>

  {/* Featured Products */}
  <Categories 
  onCategoryPress={handleCategoryPress} />

  {/* Dropdown Filter */}
  <View className="mt-6 px-4">
    <BestSellerDropdown />
  </View>
</ScrollView>

  );
}
