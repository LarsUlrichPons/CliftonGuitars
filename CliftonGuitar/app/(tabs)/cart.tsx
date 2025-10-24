import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";




// Initial mock data for the cart items
const INITIAL_CART_ITEMS = [
  { id: 1, name: "Clifton Hofner style Violin Bass", price: 13800, quantity: 1, image: "https://i.pinimg.com/736x/92/77/93/927793d7cdcb4d338576335ea1c7d675.jpg",selected: true },
  { id: 2, name: "Vintage Valve Amp 40W", price: 11000, quantity: 2, image: "https://i.pinimg.com/736x/ea/19/ac/ea19ac8b730d5cd9c9a069dcf6f548dd.jpg", selected: true },
];

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  // Handle select
  const handleItemSelect = (id: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Select All
  const handleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected);
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  // Selected items
  const selectedItems = useMemo(
    () => cartItems.filter(item => item.selected),
    [cartItems]
  );

  const totalItems = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems]
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems]
  );

  // ✅ Shipping = 0 if no selected items
  const shippingFee = selectedItems.length > 0 ? 300 : 0;
  const total = subtotal + shippingFee;

  // Delete item
  const handleDeleteItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Quantity
  const handleQuantityChange = (id: number, delta: 1 | -1) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Back navigation
  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-100">
      
      {/* 1. Header — Use SafeAreaView to correctly position the header content */}
     <SafeAreaView className="bg-white border-b border-gray-200 z-10 ">
  <View className="flex-row items-center justify-center py-5 px-4">
    {/* Back button */}
    <TouchableOpacity
      onPress={handleBack}
      className="absolute left-4 p-2"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <MaterialCommunityIcons name="chevron-left" size={30} color="#1a1a1a" />
    </TouchableOpacity>

    {/* Title */}
    <Text className="text-xl font-semibold text-[#1a1a1a]">
      My Shopping Cart
    </Text>

    {/* Placeholder for alignment consistency (keeps header centered) */}
    <View className="absolute right-4 w-16" />
  </View>
</SafeAreaView>

      {/* ScrollView content */}
      <ScrollView
        className="flex-1 mt-3"
        contentContainerStyle={{ paddingBottom: 200 }} // Reserve space for the fixed summary
        showsVerticalScrollIndicator={false}
      >
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <SwipeableCartItem
              key={item.id}
              item={item}
              onDelete={() => handleDeleteItem(item.id)}
              onQuantityChange={handleQuantityChange}
              onSelect={() => handleItemSelect(item.id)}
            />
          ))
        ) : (
          <View className="p-8 items-center justify-center bg-white m-4 rounded-xl">
            <Text className="text-lg font-medium text-gray-500">Your cart is empty.</Text>
            <Text className="text-sm text-gray-400 mt-2">Time to find some gear!</Text>
          </View>
        )}
      </ScrollView>

      {/* 3. Checkout section — flush at bottom */}
      {cartItems.length > 0 && (
        <SafeAreaView 
          edges={['bottom']} 
          className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4"
        >
          {/* Select All + Item Count */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity className="flex-row items-center" onPress={handleSelectAll}>
              <View
                className={`w-5 h-5 rounded-full mr-2 ${
                  cartItems.every(item => item.selected)
                    ? 'bg-orange-500'
                    : 'bg-gray-300'
                }`}
              />
              <Text className="text-sm font-semibold text-[#1a1a1a]">All</Text>
            </TouchableOpacity>
            <Text className="text-sm text-gray-600">Total Items: {totalItems}</Text>
          </View>

          {/* Totals */}
          <View className="space-y-1 mb-4">
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-600">Subtotal:</Text>
              <Text className="text-base text-[#1a1a1a]">
                ₱{subtotal.toLocaleString('en-PH')}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-600">Shipping Fee:</Text>
              <Text className="text-base text-[#1a1a1a]">
                ₱{shippingFee.toLocaleString('en-PH')}
              </Text>
            </View>
            <View className="flex-row justify-between pt-2">
              <Text className="text-xl font-bold text-[#1a1a1a]">Total:</Text>
              <Text className="text-xl font-bold text-red-600">
                ₱{total.toLocaleString('en-PH')}
              </Text>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            className={`p-4 rounded-xl items-center shadow-lg ${
              selectedItems.length > 0 ? 'bg-[#2E2F2A]' : 'bg-gray-400'
            }`}
            disabled={selectedItems.length === 0}
          >
            <Text className="text-lg font-bold text-white">
              {selectedItems.length > 0 ? 'Check Out' : 'No Items Selected'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </View>
  );
};

// Swipeable Cart Item Component - Fixed to match Notification swipe behavior
const SwipeableCartItem = ({ item, onDelete, onQuantityChange, onSelect }: any) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [layoutWidth, setLayoutWidth] = useState(0);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Only respond to horizontal swipes
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
    },
    onPanResponderMove: (_, gestureState) => {
      // Only allow left swipe (negative dx)
      if (gestureState.dx < 0) {
        translateX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const swipeThreshold = -80; // Minimum swipe distance to trigger delete
      
      if (gestureState.dx < swipeThreshold) {
        // Swipe successful - animate off screen and delete
        Animated.timing(translateX, {
          toValue: -layoutWidth,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onDelete();
        });
      } else {
        // Swipe not enough - reset position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
    onPanResponderTerminate: () => {
      // Reset position if gesture is terminated
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  }), [translateX, layoutWidth]);

  // Set the layout width when the component mounts
  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      onLayout={handleLayout}
      className="bg-white border-b border-gray-100 overflow-hidden"
    >
      {/* Delete Background */}
      <View className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 items-center justify-center">
        <Text className="text-white font-bold">DELETE</Text>
      </View>

      {/* Main Item Content */}
      <Animated.View
        style={{
          transform: [{ translateX }],
        }}
        {...panResponder.panHandlers}
        className="flex-row items-center p-4 bg-white"
      >
        <View className="flex-row flex-1 items-center pr-2">
          {/* Selection Dot */}
          <TouchableOpacity onPress={onSelect} className="mr-3">
            <View
              className={`w-5 h-5 rounded-full ${
                item.selected ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          </TouchableOpacity>

          {/* Image */}
          <View className="w-20 h-24 rounded-lg bg-gray-200 mr-3 overflow-hidden">
            <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
          </View>

          {/* Item Info */}
          <View className="flex-1 justify-center">
            <Text className="text-base font-medium text-[#1a1a1a] mb-1">{item.name}</Text>
            <Text className="text-lg font-bold text-red-600">
              ₱{(item.price * item.quantity).toLocaleString('en-PH')}
            </Text>
          </View>
        </View>

        {/* Quantity Control */}
        <View className="items-end">
          <View className="flex-row items-center border border-gray-300 rounded-full">
            <TouchableOpacity className="p-2" onPress={() => onQuantityChange(item.id, -1)}>
              <Text className="text-xl font-bold text-gray-600">-</Text>
            </TouchableOpacity>
            <Text className="px-3 text-base font-semibold text-[#1a1a1a]">
              {item.quantity}
            </Text>
            <TouchableOpacity className="p-2" onPress={() => onQuantityChange(item.id, 1)}>
              <Text className="text-xl font-bold text-gray-600">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Cart;