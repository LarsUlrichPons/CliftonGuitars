// components/FeaturedProductScroll.tsx

import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
// ^^^ Make sure to import Image ^^^

// Define a simple type for the product data
interface Product {
  id: number;
  name: string;
  bgColor: string; // Tailwind class for the background color
  source: any; // <-- Added source property for the image
}

interface CategoriesProps {
  // A simple handler for when a featured product is pressed
  onCategoryPress: (pcategory: string) => void;
}

export default function FeaturedProductScroll({ onCategoryPress }: CategoriesProps) {
  // NOTE: Replace these 'require' paths with your actual local image files
  // or use an object { uri: 'YOUR_URL_HERE' } for remote images.
  const featuredProducts: Product[] = [
    { 
      id: 101, 
      name: "Bass Guitar", 
      bgColor: "bg-teal-300",
      source: require('../assets/images/catalogs/bassGuitar.png'), // REPLACE with your image path
    },
    { 
      id: 102, 
      name: "Acoustic Guitar", 
      bgColor: "bg-red-700",
      source: require('../assets/images/catalogs/acousticGuitar.png'), // REPLACE with your image path
    },
    { 
      id: 103, 
      name: "Electric Guitar", 
      bgColor: "bg-yellow-700",
      source: require('../assets/images/catalogs/electricGuitar.png'), // REPLACE with your image path
    },
    { 
      id: 104, 
      name: "Basta", 
      bgColor: "bg-gray-200",
      source: require('../assets/images/catalogs/guitar.jpg'), // REPLACE with your image path
    },
  ];

  return (
    <View className="mt-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 20, 
          gap: 16,
        }}
      >
        {featuredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            // IMPORTANT: You were passing the component name, change to product.name
            onPress={() => onCategoryPress(product.name)} 
            className={`w-40 h-56 rounded-2xl overflow-hidden ${product.bgColor} shadow-lg relative`}
            activeOpacity={0.8}
          >
            {/* *** Actual Image Component *** */}
            <Image
              source={product.source}
              // flex-1 makes the image fill the entire TouchableOpacity
              className="flex-1 w-full h-full resize-contain" 
              // resizeMode: 'contain' ensures the full image is visible, 
              // which is good for product photography inside a colored frame
            />
            
            {/* Product Name overlay (Absolute positioning for the bottom) */}
            <View className="absolute bottom-0 left-0 right-0 p-2">
              <Text className="text-xl font-semibold text-white text-center">
                {product.name}
              </Text>
            </View>
            
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}