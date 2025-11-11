import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
  Image,
  Modal,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Mock Orders
const ALL_MOCK_ORDERS = [
  {
    id: 1,
    status: "To Pay",
    productName: "Clifton Hofner style Violin Bass",
    price: 13800,
    quantity: 1,
    imageUrl: "https://placehold.co/100x100/F06292/FFFFFF?text=BASS",
    cancellationStatus: null,
    cancellationReason: null,
    isRated: false, // Add this field to track if product is rated
  },
  {
    id: 2,
    status: "To Ship",
    productName: "Vintage Valve Amp 40W",
    price: 11000,
    quantity: 2,
    imageUrl: "https://placehold.co/100x100/90A4AE/FFFFFF?text=AMP",
    cancellationStatus: null,
    cancellationReason: null,
    isRated: false,
  },
  {
    id: 3,
    status: "Completed",
    productName: "Fender Stratocaster Kit",
    price: 8500,
    quantity: 1,
    imageUrl: "https://placehold.co/100x100/81C784/FFFFFF?text=STRAT",
    cancellationStatus: null,
    cancellationReason: null,
    isRated: false,
  },
  {
    id: 4,
    status: "To Pay",
    productName: "Extra Guitar Strings (Set of 3)",
    price: 900,
    quantity: 3,
    imageUrl: "https://placehold.co/100x100/FFCC80/000000?text=STRINGS",
    cancellationStatus: null,
    cancellationReason: null,
    isRated: false,
  },
  {
    id: 5,
    status: "Cancelled",
    productName: "Pedalboard Power Supply",
    price: 4500,
    quantity: 1,
    imageUrl: "https://placehold.co/100x100/E57373/FFFFFF?text=PSU",
    cancellationStatus: "Cancelled",
    cancellationReason: "Changed my mind",
    isRated: false,
  },
  {
    id: 6,
    status: "To Receive",
    productName: "Pedalboard Power Supply",
    price: 4500,
    quantity: 1,
    imageUrl: "https://placehold.co/100x100/E57373/FFFFFF?text=PSU",
    cancellationStatus: null,
    cancellationReason: null,
    isRated: false,
  },
  {
    id: 7,
    status: "Cancelled",
    productName: "Guitar Tuner Pro",
    price: 1200,
    quantity: 1,
    imageUrl: "https://placehold.co/100x100/9575CD/FFFFFF?text=TUNER",
    cancellationStatus: "Processing",
    cancellationReason: "Found a better price elsewhere",
    isRated: false,
  },
  {
    id: 8,
    status: "Return/Refunded",
    productName: "Guitar Tuner Pro",
    price: 1200,
    quantity: 1,
    imageUrl: "https://placehold.co/100x100/9575CD/FFFFFF?text=TUNER",
    cancellationStatus: "Cancelled",
    cancellationReason: "Found a better price elsewhere",
    isRated: false,
  },
];

const TABS = [
  "To Pay",
  "To Ship",
  "To Receive",
  "Completed",
  "Return/Refunded",
  "Cancelled",
];

const MyOrders = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialTab = (params.activeTab as string) || "To Pay";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState(ALL_MOCK_ORDERS);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<number | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  const HEADER_TOP_PADDING =
    Platform.OS === "android" ? (StatusBar.currentHeight || 50) + 10 : 60;

  // Handle cancellation when returning from CancelOrder
  useEffect(() => {
    if (params.cancelledOrderId && params.previousStatus) {
      const cancelledOrderId = parseInt(params.cancelledOrderId as string);
      const cancellationReason = params.cancellationReason as string;
      
      // Update the order status to "Cancelled" and set cancellation status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === cancelledOrderId 
            ? { 
                ...order, 
                status: "Cancelled",
                cancellationStatus: "Processing",
                cancellationReason: cancellationReason
              }
            : order
        )
      );
      
      // Set active tab to Cancelled
      setActiveTab('Cancelled');
      
      // Clear the params to prevent repeated execution
      router.setParams({ 
        activeTab: 'Cancelled',
        cancelledOrderId: undefined,
        cancellationReason: undefined,
        previousStatus: undefined
      });
    }
  }, [params.cancelledOrderId, params.previousStatus]);

  // Handle when returning from RateProduct with rated order
  useEffect(() => {
    if (params.ratedOrderId) {
      const ratedOrderId = parseInt(params.ratedOrderId as string);
      
      // Update the order to mark it as rated
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === ratedOrderId 
            ? { 
                ...order, 
                isRated: true // Mark as rated
              }
            : order
        )
      );
      
      // Clear the params to prevent repeated execution
      router.setParams({ 
        ratedOrderId: undefined
      });
    }
  }, [params.ratedOrderId]);

  // Return/Refund
  useEffect(() => {
    if (params.returnedOrderId && params.previousStatus) {
      const returnedOrderId = parseInt(params.returnedOrderId as string);
      const returnReason = params.returnReason as string;

      // Update the order status to "Return/Refunded"
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === returnedOrderId
            ? {
                ...order,
                status: "Return/Refunded",
                cancellationStatus: "Processing", // reuse cancellationStatus field
                cancellationReason: returnReason,
              }
            : order
        )
      );

      // Set active tab to Return/Refunded
      setActiveTab("Return/Refunded");

      // Clear the params to prevent repeated execution
      router.setParams({
        activeTab: "Return/Refunded",
        returnedOrderId: undefined,
        returnReason: undefined,
        previousStatus: undefined,
      });
    }
  }, [params.returnedOrderId, params.previousStatus]);

  const handleOrderPress = (orderId: number, currentStatus: string) => {
    router.push(`/OrderDetails?id=${orderId}&status=${currentStatus}`);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)/profile"); // only active while on MyOrders
        return true; // prevent default behavior
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove(); // cleanup when leaving screen
    }, [])
  );

  const showCompleteOrderPopup = (orderId: number) => {
    setCompletedOrderId(orderId);
    setShowCompletePopup(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideCompleteOrderPopup = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowCompletePopup(false);
      setCompletedOrderId(null);
    });
  };

  const handleCompleteOrder = (orderId: number, event: any) => {
    event.stopPropagation();
    showCompleteOrderPopup(orderId);
  };

  const confirmCompleteOrder = () => {
    if (completedOrderId) {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === completedOrderId 
            ? { ...order, status: "Completed" }
            : order
        )
      );
      hideCompleteOrderPopup();
      setActiveTab('Completed')
    }
  };

  const handleRequestRefundReturn = (orderId: number, event: any) => {
    event.stopPropagation();
    
    const order = orders.find(order => order.id === orderId);
    if (!order) return;

    router.push({
      pathname: '/Return_Refunded',
      params: { 
        orderId: orderId.toString(),
        productName: order.productName,
        price: order.price.toString(),
        imageUrl: order.imageUrl,
        status: order.status,
        previousTab: activeTab
      }
    });
  };

  const handleRateProduct = (orderId: number, event: any) => {
    event.stopPropagation();
    const order = orders.find(order => order.id === orderId);
    if (!order) return;

    // Don't proceed if already rated
    if (order.isRated) {
      return;
    }

    router.push({
      pathname: '/RateProduct',
      params: { 
        orderId: orderId.toString(),
        productName: order.productName,
        price: order.price.toString(),
        imageUrl: order.imageUrl
      }
    });
  };

  const handleCancelOrder = (orderId: number, event: any) => {
    event.stopPropagation();
    
    const order = orders.find(order => order.id === orderId);
    if (!order) return;

    router.push({
      pathname: '/CancelOrder',
      params: { 
        orderId: orderId.toString(),
        productName: order.productName,
        price: order.price.toString(),
        imageUrl: order.imageUrl,
        status: order.status,
        previousTab: activeTab // Store current tab for reference
      }
    });
  };

  const scrollRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    const index = TABS.findIndex(tab => tab === activeTab);
    if (scrollRef.current && index >= 0) {
      // Approximate scroll position based on index
      scrollRef.current.scrollTo({ 
        x: index * 100, // Adjust 100 depending on your tab width + margin
        animated: true 
      });
    }
  }, [activeTab]);

  // Complete Order Popup Component
  const CompleteOrderPopup = () => (
    <Modal
      visible={showCompletePopup}
      transparent
      animationType="none"
      onRequestClose={hideCompleteOrderPopup}
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
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-3">
              <Feather name="check-circle" size={24} color="#10B981" />
            </View>
            <Text className="text-xl font-bold text-gray-800">
              Order Completed
            </Text>
          </View>

          <View className="items-center mb-6">
            <Text className="text-base text-gray-600 text-center leading-6">
              Your order has been successfully marked as completed.
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6 mt-2">
              Thank you for your purchase!
            </Text>
          </View>

          <TouchableOpacity
            onPress={confirmCompleteOrder}
            className="bg-green-500 py-3 rounded-xl mt-2"
          >
            <Text className="text-white text-center font-bold text-base">
              OK
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  const getCancellationStatusColor = (status: string | null) => {
    switch (status) {
      case "Processing":
        return "text-blue-600 bg-blue-100";
      case "Cancelled":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCancellationStatusText = (status: string | null, type: "cancel" | "return" = "cancel") => {
    switch (status) {
      case "Processing":
        return type === "return" ? "Processing Return" : "Processing Cancellation";
      case "Cancelled":
        return type === "return" ? "Return Successful" : "Successfully Cancelled";
      case "Rejected":
        return type === "return" ? "Return Rejected" : "Cancellation Rejected";
      default:
        return type === "return" ? "Returned" : "Cancelled";
    }
  };

  const OrderCard = ({ order }: any) => {
    const isPayable = order.status === "To Pay";
    const isCompleted = order.status === "Completed";
    const isToReceive = order.status === "To Receive";
    const isCancelled = order.status === "Cancelled";
    const isReturned = order.status === "Return/Refunded";
    const isRated = order.isRated; // Check if product is already rated

    return (
      <TouchableOpacity 
        onPress={() => handleOrderPress(order.id, order.status)}
        className="bg-white mx-4 mb-4 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
          <View className="flex-row items-center">
            <Text className="text-sm font-semibold text-gray-500 mr-2">
              {order.status}
            </Text>
            {(isCancelled || isReturned) && order.cancellationStatus && (
              <View className={`px-2 py-1 rounded-full ${getCancellationStatusColor(order.cancellationStatus)}`}>
                <Text className="text-xs font-medium">
                  {getCancellationStatusText(order.cancellationStatus, isReturned? "return": "cancel")}
                </Text>
              </View>
            )}
          </View>
          <Feather name="chevron-right" size={18} color="#9ca3af" />
        </View>

        <View className="flex-row items-center p-4">
          <Image
            source={{ uri: order.imageUrl }}
            className="w-16 h-16 rounded mr-4"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-base font-medium text-black mb-1">
              {order.productName}
            </Text>
            <Text className="text-xl font-medium text-red-600">
              ₱{order.price.toLocaleString("en-PH")}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Quantity: x{order.quantity}
            </Text>
            {/* Show rated status */}
            {isRated && (
              <View className="flex-row items-center mt-1">
                <Feather name="check-circle" size={14} color="#10B981" />
                <Text className="text-xs text-green-600 ml-1 font-medium">
                  Already Rated
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons - Only show for specific statuses */}
        {(isPayable || isToReceive || isCompleted) && (
          <View className="flex-row justify-end p-4 border-t border-gray-100">
            {isPayable && (
              <TouchableOpacity
                onPress={(e) => handleCancelOrder(order.id, e)}
                className="bg-red-500 px-4 py-2 rounded-lg mr-3"
              >
                <Text className="text-white font-medium">Cancel</Text>
              </TouchableOpacity>
            )}

            {isToReceive && (
              <TouchableOpacity
                onPress={(e) => handleCompleteOrder(order.id, e)}
                className="bg-green-500 px-4 py-2 rounded-lg mr-3"
              >
                <Text className="text-white font-medium">Complete Order</Text>
              </TouchableOpacity>
            )}

            {isCompleted && (
              <>
                <TouchableOpacity
                  onPress={(e) => handleRateProduct(order.id, e)}
                  disabled={isRated} // Disable if already rated
                  className={`px-4 py-2 rounded-lg mr-3 ${
                    isRated 
                      ? 'bg-gray-300' 
                      : 'bg-yellow-400'
                  }`}
                >
                  <Text className={`font-medium ${
                    isRated 
                      ? 'text-gray-500' 
                      : 'text-black'
                  }`}>
                    {isRated ? 'Already Rated' : 'Rate Product'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={(e) => handleRequestRefundReturn(order.id, e)}
                  className="bg-gray-600 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Refund/Return</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Additional info for cancelled orders */}
        {(isCancelled|| isReturned) && order.cancellationStatus === "Processing" && (
          <View className="px-4 py-3 bg-blue-50 border-t border-blue-100">
            <Text className="text-sm text-blue-700 text-center">
              {isReturned
                ? "Your return request is being reviewed by the seller"
                : "Your cancellation request is being reviewed by the seller"}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-1 bg-gray-100">
        {/* HEADER */}
        <View
          style={{ paddingTop: HEADER_TOP_PADDING }}
          className="flex-row items-center justify-start bg-white px-4 py-4 border-b border-gray-200"
        >
          <TouchableOpacity onPress={() =>router.push('/(tabs)/profile')} className="p-2 mr-3">
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color="#1a1a1a"
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">My Purchase</Text>
        </View>

        {/* TABS */}
        <View className="bg-white border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-2"
            ref={scrollRef}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 10,
              gap: 14,
            }}
          >
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`py-2 rounded-full border ${
                  activeTab === tab
                    ? "border-[#FF9500] bg-[#FFF4E5]"
                    : "border-gray-300 bg-transparent"
                }`}
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeTab === tab ? "text-[#FF9500]" : "text-gray-700"
                  }`}
                  numberOfLines={1}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CONTENT */}
        <ScrollView className="flex-1 pt-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <View className="items-center justify-center p-10 mt-10">
              <Text className="text-gray-500 text-lg">
                No orders found in {activeTab}.
              </Text>
            </View>
          )}
          <View className="h-20" />
        </ScrollView>

        {/* Complete Order Popup */}
        <CompleteOrderPopup />
      </View>
    </SafeAreaView>
  );
};

export default MyOrders;