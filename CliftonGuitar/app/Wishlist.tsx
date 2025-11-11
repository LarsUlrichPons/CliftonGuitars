import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Animated,
  PanResponder,
  LayoutChangeEvent,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// Mock wishlist data
const MOCK_WISHLIST = [
  {
    id: 1,
    productName: "Clifton Hofner style Violin Bass",
    price: 13800,
    imageUrl: "https://placehold.co/100x100/F06292/FFFFFF?text=BASS",
    inStock: true,
  },
  {
    id: 2,
    productName: "Vintage Valve Amp 40W",
    price: 11000,
    imageUrl: "https://placehold.co/100x100/90A4AE/FFFFFF?text=AMP",
    inStock: true,
  },
  {
    id: 3,
    productName: "Fender Stratocaster Kit",
    price: 8500,
    imageUrl: "https://placehold.co/100x100/81C784/FFFFFF?text=STRAT",
    inStock: false,
  },
  {
    id: 214,
    productName: "Extra Guitar Strings (Set of 3)",
    price: 900,
    imageUrl: "https://placehold.co/100x100/FFCC80/000000?text=STRINGS",
    inStock: true,
  },
  {
    id: 31234,
    productName: "Extra Guitar Strings (Set of 3)",
    price: 900,
    imageUrl: "https://placehold.co/100x100/FFCC80/000000?text=STRINGS",
    inStock: true,
  },
  {
    id: 34,
    productName: "Extra Guitar Strings (Set of 3)",
    price: 900,
    imageUrl: "https://placehold.co/100x100/FFCC80/000000?text=STRINGS",
    inStock: true,
  },
  {
    id: 24,
    productName: "Extra Guitar Strings (Set of 3)",
    price: 900,
    imageUrl: "https://placehold.co/100x100/FFCC80/000000?text=STRINGS",
    inStock: true,
  },
  {
    id: 410,
    productName: "Extra Guitar Strings (Set of 3)",
    price: 900,
    imageUrl: "https://placehold.co/100x100/FFCC80/000000?text=STRINGS",
    inStock: true,
  },
];

const Wishlist = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successProduct, setSuccessProduct] = useState<any>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleAddToCart = (product: any) => {
    if (!product.inStock) {
      Alert.alert("Out of Stock", "This product is currently out of stock.");
      return;
    }

    // Show beautiful success popup
    setSuccessProduct(product);
    showSuccessPopupAnimation();
  };

  const showSuccessPopupAnimation = () => {
    setShowSuccessPopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideSuccessPopup = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccessPopup(false);
      setSuccessProduct(null);
    });
  };

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  // New function to handle product click
  const handleProductPress = (product: any) => {
    router.push({
      pathname: "/products_detail",
      params: {
        productId: product.id.toString(),
        productName: product.productName,
        productPrice: product.price.toString(),
        productImage: product.imageUrl,
        // Add any other product details you want to pass
      }
    });
  };

  // Success Popup Component
  const SuccessPopup = () => (
    <Modal
      visible={showSuccessPopup}
      transparent
      animationType="none"
      onRequestClose={hideSuccessPopup}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            }]
          }}
          className="bg-white rounded-2xl p-6 mx-4 w-80 shadow-lg"
        >
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-3">
              <Feather name="check-circle" size={32} color="#10B981" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Added to Cart
            </Text>
          </View>

          <View className="items-center mb-6">
            <Text className="text-base text-gray-600 text-center leading-6">
              {successProduct?.productName}
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6 mt-2">
              has been successfully added to your cart.
            </Text>
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => {
                hideSuccessPopup();
                router.push('/cart');
              }}
              className="flex-1 bg-[#FF9500] py-3 rounded-xl"
            >
              <Text className="text-white text-center font-medium text-base">
                View Cart
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  // Swipeable Wishlist Item Component
  const SwipeableWishlistItem = ({ item, onDelete, onProductPress }: any) => {
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
                onDelete(item.id);
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
      [translateX, layoutWidth, item.id, onDelete]
    );

    const handleLayout = (event: LayoutChangeEvent) => {
      setLayoutWidth(event.nativeEvent.layout.width);
    };

    // Handle product press (product image and info area)
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
            {/* Clickable Product Area */}
            <TouchableOpacity 
              onPress={handleContentPress}
              className="flex-row flex-1 items-center"
            >
              <View className="w-20 h-20 rounded-lg bg-gray-200 mr-4 overflow-hidden">
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              <View className="flex-1 justify-center">
                <Text className="text-base font-medium text-[#1a1a1a] mb-1">
                  {item.productName}
                </Text>
                <Text className="text-lg font-bold text-red-600 mb-2">
                  ₱{item.price.toLocaleString("en-PH")}
                </Text>
                
                {/* Stock Status */}
                {!item.inStock && (
                  <View className="flex-row items-center">
                    <Text className="text-sm text-red-600 font-medium">
                      Out of Stock
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button - Not part of the clickable product area */}
          <View className="items-end">
            <TouchableOpacity
              onPress={() => handleAddToCart(item)}
              disabled={!item.inStock}
              className={`px-4 py-2 rounded-lg ${
                item.inStock ? 'bg-[#FF9500]' : 'bg-gray-400'
              }`}
            >
              <Text className="text-white text-center font-medium text-sm">
                Add to Cart
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View className="bg-white border-b border-gray-200 z-10">
        <View className="flex-row items-center justify-center py-5 px-4">
          <TouchableOpacity
            onPress={() => router.back()}
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
            My Wish List
          </Text>

          <View className="absolute right-4 w-16" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 bg-gray-100">
        {wishlist.length > 0 ? (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
            // Important: Let the ScrollView handle vertical scrolling
            scrollEventThrottle={16}
            directionalLockEnabled={true}
          >
            {wishlist.map((item) => (
              <SwipeableWishlistItem
                key={item.id}
                item={item}
                onDelete={handleRemoveFromWishlist}
                onProductPress={() => handleProductPress(item)}
              />
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center p-8 bg-white m-4 rounded-xl">
            <Text className="text-lg font-medium text-gray-500 mb-2">
              Your wishlist is empty
            </Text>
            <Text className="text-sm text-gray-400 text-center mb-6">
              Start adding items you love to your wishlist
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/home')}
              className="bg-[#FF9500] px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium text-base">
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Success Popup */}
      <SuccessPopup />
    </SafeAreaView>
  );
};

export default Wishlist;