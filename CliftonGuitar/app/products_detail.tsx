import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
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

const ProductDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ✅ Convert params safely
  const product = {
    id: params.id ?? "123",
    name: params.name ?? "Clifton Hofner Style Violin Bass",
    price: params.price ?? "13,800",
    imageUrl:
      typeof params.imageUrl === "string" && params.imageUrl.trim() !== ""
        ? params.imageUrl
        : "https://via.placeholder.com/600x400/CCCCCC/FFFFFF?text=Violin+Bass",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tempus dignissim nisl, quis interdum dolor pretium in. Sed nibh nisl, pretium in eleifend id, blandit aliquet diam.",
    colors: ["#FF9500", "#5856D6", "#34C759"],
  };

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleBack = () => router.back();
  const handleAddToCart = () => console.log("Added to cart:", product.name);
  const handleBuyNow = () => console.log("Buying now:", product.name);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === "android" ? "#FFFFFF" : "transparent"}
      />

      {/* ===================== HEADER ===================== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerIconLeft}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DETAILS</Text>
        <TouchableOpacity style={styles.headerIconRight}>
          <Ionicons name="cart-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* ===================== CONTENT ===================== */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* PRODUCT IMAGE */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.detailsContainer}>
          <View style={styles.priceAndName}>
            <View>
              <Text style={styles.productPrice}>₱ {product.price}</Text>
              <Text style={styles.productName}>{product.name}</Text>
            </View>
            <TouchableOpacity style={styles.heartIcon}>
              <Ionicons name="heart-outline" size={35} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <Text style={styles.colorsLabel}>Colors</Text>
          <View style={styles.colorOptions}>
            {product.colors.map((color, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
              />
            ))}
          </View>

          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* ===================== BUTTONS ===================== */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="add" size={18} color="#000" />
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Ionicons name="bag-handle-outline" size={18} color="#fff" />
          <Text style={styles.buyNowButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 40) : 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    textTransform: "uppercase",
  },
  headerIconLeft: { padding: 4 },
  headerIconRight: { padding: 4 },

  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "95%",
    height: "95%",
  },

  detailsContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  priceAndName: {
  position: "relative",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  marginBottom: 12,
},
  productPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#dc2626",
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  heartIcon: {
  position: "absolute",
  right: 0.1,
  top: 0.1,
  padding: 1,
 
 
},
  colorsLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 8,
  },
  colorOptions: {
    flexDirection: "row",
    marginBottom: 16,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#ccc",
  },
  selectedColor: {
    borderColor: "#1a1a1a",
    borderWidth: 2.5,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 50, // same as your screenshot spacing
    left: 16,
    right: 16,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addToCartButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginLeft: 4,
  },
  buyNowButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF9500",
    borderRadius: 8,
    paddingVertical: 10,
    marginLeft: 10,
  },
  buyNowButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 4,
  },
});
