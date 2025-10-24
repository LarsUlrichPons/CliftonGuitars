import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockProducts = [
  { id: 1, name: "Clifton Strat Pro", category: "Electric Guitars", price: 899, image: "https://placehold.co/200x200/2E2F2A/ffffff?text=Electric" },
  { id: 2, name: "Roadhouse Bass", category: "Bass Guitars", price: 650, image: "https://placehold.co/200x200/6D7260/ffffff?text=Bass" },
  { id: 3, name: "Acoustic Dreadnought X", category: "Acoustic Guitars", price: 520, image: "https://placehold.co/200x200/9C9E8C/ffffff?text=Acoustic" },
  { id: 4, name: "Vintage Valve Amp 40W", category: "Amplifiers", price: 1100, image: "https://placehold.co/200x200/C1B99B/ffffff?text=Amp" },
  { id: 5, name: "Premium Strap (Black)", category: "Accessories", price: 35, image: "https://placehold.co/200x200/2E2F2A/ffffff?text=Accessory" },
  { id: 6, name: "Stratocaster HSS", category: "Electric Guitars", price: 999, image: "https://placehold.co/200x200/6D7260/ffffff?text=Electric" },
  { id: 7, name: "J-Bass Standard", category: "Bass Guitars", price: 750, image: "https://placehold.co/200x200/9C9E8C/ffffff?text=Bass" },
  { id: 8, name: "Concert Ukulele", category: "Acoustic Guitars", price: 150, image: "https://placehold.co/200x200/C1B99B/ffffff?text=Acoustic" },
];

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const selectedCategory = params.category as string || "All Products";

  const isAllProducts = selectedCategory === "" || selectedCategory === "All Products";

  const filteredProducts = mockProducts.filter(product =>
    isAllProducts || product.category === selectedCategory
  );

  const handleBack = () => {
    router.back();
  };

  return (
   
    <SafeAreaView className="flex-1 bg-white">
      {/* Header matching Cart.tsx */}
      <View className="flex-row items-center justify-center p-4 bg-white border-b border-gray-200">
        <TouchableOpacity 
          onPress={handleBack} 
          className="absolute left-4 p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-2xl text-gray-800">{'<'}</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-[#1a1a1a]">
          {selectedCategory || "All Products"}
        </Text>
      </View>

      <ScrollView className="flex-1 bg-gray-100">
        {/* Category Info */}
        <View className="px-4 py-3 bg-white border-b border-gray-200">
          <Text className="text-sm text-gray-600 font-medium">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* Product Grid */}
        <View className="flex-row flex-wrap justify-between px-4 py-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <TouchableOpacity
                key={product.id}
                className="w-[48%] mb-6 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                onPress={() => console.log(`View product: ${product.name}`)}
                activeOpacity={0.8}
              >
                {/* Product Image */}
                <View className="h-36 w-full items-center justify-center bg-[#2E2F2A]">
                  <Image
                    source={{ uri: product.image }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>
                
                {/* Product Info */}
                <View className="p-3">
                  <Text className="text-base font-bold text-[#1a1a1a] mb-1 leading-5" numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text className="text-lg font-extrabold text-red-600">
                    ${product.price.toFixed(2)}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {product.category}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="w-full items-center justify-center py-16">
              <Text className="text-lg font-medium text-gray-500">No products found in this category.</Text>
              <Text className="text-sm text-gray-400 mt-2">Try browsing other categories</Text>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}