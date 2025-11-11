import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutChangeEvent,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: "Clifton Hofner style Violin Bass",
    price: 13800,
    quantity: 1,
    image:
      "https://i.pinimg.com/736x/92/77/93/927793d7cdcb4d338576335ea1c7d675.jpg",
    selected: false,
  },
  {
    id: 2,
    name: "Vintage T-Style Electric Guitar",
    price: 89900,
    quantity: 1,
    image:
      "https://i.pinimg.com/736x/ef/62/98/ef629893cb15e54bed639feaccfef52f.jpg",
    selected: false,
  },
  {
    id: 3,
    name: "Rosewood Acoustic Dreadnought",
    price: 64950,
    quantity: 1,
    image:
      "https://i.pinimg.com/736x/e9/f7/11/e9f711baf61c48aa44aa2a3f748a6653.jpg",
    selected: false,
  },
  {
    id: 4,
    name: "P-Bass Style Electric Bass",
    price: 105000,
    quantity: 1,
    image:
      "https://i.pinimg.com/736x/94/47/28/9447282594503f22d96b7518c36a4fe4.jpg",
    selected: false,
  },
  {
    id: 5,
    name: "15W All-Tube Combo Amplifier",
    price: 42000,
    quantity: 1,
    image: "https://i.pinimg.com/736x/d8/e0/07/d8e007288afaf8bb84a7cb3651ec36cc.jpg",
    selected: false,
  },
  {
    id: 6,
    name: "Classic Fuzz Distortion Pedal",
    price: 11999,
    quantity: 2,
    image:
      "https://scontent.fmnl33-6.fna.fbcdn.net/v/t1.15752-9/575418810_2909238389464956_4677990410017017822_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEkWp-uAXrkzntlhvtttIy_EhVPE0SwuLkSFU8TRLC4uS53-B4poF3U42VUpr05NP6XISkAQ-muZhNuomxdiZdk&_nc_ohc=LydfmQL3K_wQ7kNvwEHfgXb&_nc_oc=AdlDQCx_ElnjhsxKb59VCJxp7jVloRTAXxNIuJm07gRbnj5BZAe3Bn05k6S0cGZ4Gw_FQ0216TBdIdykj8SCBBMp&_nc_zt=23&_nc_ht=scontent.fmnl33-6.fna&oh=03_Q7cD3wHsLIsgTaAfgg0ll1UpTuhSC7zHvcRVYyNM3QjIF9molA&oe=6937D051",
    selected: true,
  },
  {
    id: 7,
    name: "5-Piece Maple Drum Kit (Natural Finish)",
    price: 129900,
    quantity: 1,
    image: "https://scontent.fmnl33-2.fna.fbcdn.net/v/t1.15752-9/575496116_1579570653203180_3925896154167759297_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFj_VtkLv5HfFMul4Yf58wBmQrp2rp3ck6ZCunaundyTmYDnaaaPGoJ6e6J_ohvOaUWC4yPF57w_mc5XcfvkraU&_nc_ohc=GG0lsckDCawQ7kNvwE3hSaS&_nc_oc=AdkQpImoAXwkN5VGe_MjwjQgot1IwyfBqvejaT7Wrc654YMJdFRBPcb4qpHtcl9h5sg1Ej0PU2kuzPY5V28Ic-iB&_nc_zt=23&_nc_ht=scontent.fmnl33-2.fna&oh=03_Q7cD3wGxxTRAttVn0FoRCMp5nd-6S8P6bmbd6PEbvcuXXAK04w&oe=6937E861",
    selected: false,
  },
  {
    id: 8,
    name: "88-Key Weighted Digital Piano",
    price: 98500,
    quantity: 1,
    image:
      "https://i.pinimg.com/736x/e4/a0/23/e4a023b0928edee5ff675c198a4db1f4.jpg",
    selected: false,
  },
  {
    id: 9,
    name: "Professional Alto Saxophone",
    price: 155000,
    quantity: 1,
    image:
      "https://i.pinimg.com/736x/01/ca/ee/01caee0f70a9a13b66afd556cb657fe5.jpg",
    selected: false,
  },
  {
    id: 10,
    name: "Large Diaphragm Studio Condenser Mic",
    price: 27500,
    quantity: 3,
    image:
      "https://i.pinimg.com/736x/df/94/d4/df94d499fcc6c27d27582df3c137297b.jpg",
    selected: false,
  },
  {
    id: 11,
    name: "Studio Reference Monitor Headphones",
    price: 9990,
    quantity: 1,
    image:
      "https://i.pinimg.com/736x/42/22/3e/42223e089e29063b62ced2fe53d8260b.jpg",
    selected: false,
  },
];

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  const handleItemSelect = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every((item) => item.selected);
    setCartItems((prevItems) =>
      prevItems.map((item) => ({ ...item, selected: !allSelected }))
    );
  };

  const selectedItems = useMemo(
    () => cartItems.filter((item) => item.selected),
    [cartItems]
  );

  const totalItems = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems]
  );

  const subtotal = useMemo(
    () =>
      selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems]
  );

  const shippingFee = selectedItems.length > 0 ? 300 : 0;
  const total = subtotal + shippingFee;

  const handleDeleteItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: number, delta: 1 | -1) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleBack = () => {
    router.back();
  };

  const handleCheckout = () => {
    if (selectedItems.length > 0) {
      const selectedItemsJSON = JSON.stringify(selectedItems);
      router.push({
        pathname: "/Checkout",
        params: {
          selectedItems: selectedItemsJSON,
          subtotal: subtotal.toString(),
          shippingFee: shippingFee.toString(),
          total: total.toString(),
        },
      });
    }
  };

  // New function to handle product click
  const handleProductPress = (product: any) => {
    router.push({
      pathname: "/products_detail",
      params: {
        productId: product.id.toString(),
        productName: product.name,
        productPrice: product.price.toString(),
        productImage: product.image,
        // Add any other product details you want to pass
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View className="flex-1 bg-gray-100">
        
        {/* HEADER */}
        <View className="bg-white border-b border-gray-200 z-10">
          <View className="flex-row items-center justify-center py-5 px-4">
            <TouchableOpacity
              onPress={handleBack}
              className="absolute left-4 p-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color="#1a1a1a"
              />
            </TouchableOpacity>

            <Text className="text-xl font-semibold text-[#1a1a1a]">
              My Shopping Cart
            </Text>

            <View className="absolute right-4 w-16" />
          </View>
        </View>

        {/* ITEMS SCROLLVIEW - Only items/products are scrollable */}
        <View className="flex-1">
          {cartItems.length > 0 ? (
            <ScrollView
              className="flex-1 mt-3"
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={true}
              // Important: Let the ScrollView handle vertical scrolling
              scrollEventThrottle={16}
              directionalLockEnabled={true}
            >
              {cartItems.map((item) => (
                <SwipeableCartItem
                  key={item.id}
                  item={item}
                  onDelete={() => handleDeleteItem(item.id)}
                  onQuantityChange={handleQuantityChange}
                  onSelect={() => handleItemSelect(item.id)}
                  onProductPress={() => handleProductPress(item)}
                />
              ))}
            </ScrollView>
          ) : (
            <View className="p-8 items-center justify-center bg-white m-4 rounded-xl">
              <Text className="text-lg font-medium text-gray-500">
                Your cart is empty.
              </Text>
              <Text className="text-sm text-gray-400 mt-2">
                Time to find some gear!
              </Text>
            </View>
          )}
        </View>

        {/* FOOTER (CHECKOUT SECTION) - Fixed at bottom */}
        {cartItems.length > 0 && (
          <SafeAreaView
            edges={["bottom"]}
            className="bg-white border-t border-gray-200 p-4"
          >
            {/* Select All */}
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={handleSelectAll}
              >
                <View
                  className={`w-5 h-5 rounded-full mr-2 ${
                    cartItems.every((item) => item.selected)
                      ? "bg-orange-500"
                      : "bg-gray-300"
                  }`}
                />
                <Text className="text-sm font-semibold text-[#1a1a1a]">All</Text>
              </TouchableOpacity>
              <Text className="text-sm text-gray-600">
                Total Items: {totalItems}
              </Text>
            </View>

            {/* Totals */}
            <View className="space-y-1 mb-4">
              <View className="flex-row justify-between">
                <Text className="text-base text-gray-600">Subtotal:</Text>
                <Text className="text-base text-[#1a1a1a]">
                  ₱{subtotal.toLocaleString("en-PH")}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-base text-gray-600">Shipping Fee:</Text>
                <Text className="text-base text-[#1a1a1a]">
                  ₱{shippingFee.toLocaleString("en-PH")}
                </Text>
              </View>
              <View className="flex-row justify-between pt-2">
                <Text className="text-xl font-bold text-[#1a1a1a]">Total:</Text>
                <Text className="text-xl font-bold text-red-600">
                  ₱{total.toLocaleString("en-PH")}
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              onPress={handleCheckout}
              className={`p-4 rounded-xl items-center shadow-lg ${
                selectedItems.length > 0 ? "bg-[#2E2F2A]" : "bg-gray-400"
              }`}
              disabled={selectedItems.length === 0}
            >
              <Text className="text-lg font-bold text-white">
                {selectedItems.length > 0
                  ? "Check Out"
                  : "No Items Selected"}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
      </View>
    </SafeAreaView>
  );
};

// ✅ Updated Swipeable Cart Item with product click functionality
const SwipeableCartItem = ({ item, onDelete, onQuantityChange, onSelect, onProductPress }: any) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [layoutWidth, setLayoutWidth] = useState(0);
  const panResponderRef = useRef<any>(null);

  panResponderRef.current = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only capture horizontal swipes, let vertical scroll through
          return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dx < 0) {
            translateX.setValue(gestureState.dx);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const swipeThreshold = -80;
          if (gestureState.dx < swipeThreshold) {
            Animated.timing(translateX, {
              toValue: -layoutWidth,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              onDelete();
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderReject: () => {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [translateX, layoutWidth, onDelete]
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  };

  // Handle product press (excluding the checkbox and quantity controls)
  const handleContentPress = () => {
    onProductPress();
  };

  return (
    <View onLayout={handleLayout} className="bg-white border-b border-gray-100 overflow-hidden">
      {/* Delete Background */}
      <View className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 items-center justify-center">
        <Text className="text-white font-bold">DELETE</Text>
      </View>

      {/* Main Content */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponderRef.current.panHandlers}
        className="flex-row items-center p-4 bg-white"
      >
        <View className="flex-row flex-1 items-center pr-2">
          {/* Checkbox - Not part of the clickable product area */}
          <TouchableOpacity onPress={onSelect} className="mr-3">
            <View
              className={`w-5 h-5 rounded-full ${
                item.selected ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
          </TouchableOpacity>

          {/* Clickable Product Area */}
          <TouchableOpacity 
            onPress={handleContentPress}
            className="flex-row flex-1 items-center"
          >
            <View className="w-20 h-24 rounded-lg bg-gray-200 mr-3 overflow-hidden">
              <Image
                source={{ uri: item.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 justify-center">
              <Text className="text-base font-medium text-[#1a1a1a] mb-1">
                {item.name}
              </Text>
              <Text className="text-lg font-bold text-red-600">
                ₱{(item.price * item.quantity).toLocaleString("en-PH")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quantity Controls - Not part of the clickable product area */}
        <View className="items-end">
          <View className="flex-row items-center border border-gray-300 rounded-full">
            <TouchableOpacity
              className="p-2"
              onPress={() => onQuantityChange(item.id, -1)}
            >
              <Text className="text-xl font-bold text-gray-600">-</Text>
            </TouchableOpacity>
            <Text className="px-3 text-base font-semibold text-[#1a1a1a]">
              {item.quantity}
            </Text>
            <TouchableOpacity
              className="p-2"
              onPress={() => onQuantityChange(item.id, 1)}
            >
              <Text className="text-xl font-bold text-gray-600">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Cart;