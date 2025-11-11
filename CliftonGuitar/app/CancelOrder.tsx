import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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

const CancelOrder = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const HEADER_TOP_PADDING =
    Platform.OS === "android" ? (StatusBar.currentHeight || 50) + 10 : 60;

  const cancellationReasons = [
    "Ordered by mistake",
    "Changed my mind",
    "Found a Better Price",
    "Item too expensive",
    "Delivery takes too long",
    "Duplicate order",
    "Other reason"
  ];

  // Get order details from params
  const orderDetails = {
    id: params.orderId ? parseInt(params.orderId as string) : 0,
    name: params.productName as string || "Product Name",
    price: params.price ? parseInt(params.price as string) : 0,
    imageUrl: params.imageUrl as string || "https://placehold.co/100x100/FFCC80/000000?text=PRODUCT",
    status: params.status as string || "To Pay"
  };

  const showSuccessPopupHandler = () => {
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
      // Navigate back to MyOrders with Cancelled tab active and pass cancellation data
      router.push({
        pathname: '/MyOrders',
        params: { 
          activeTab: 'Cancelled',
          cancelledOrderId: orderDetails.id.toString(),
          cancellationReason: selectedReason,
          previousStatus: orderDetails.status
        }
      });
    });
  };

  const handleSubmitCancellation = () => {
    if (selectedReason && isConfirmed) {
      // Here you would typically make an API call to submit the cancellation
      console.log(`Cancelling order ${orderDetails.id} for reason: ${selectedReason}`);
      showSuccessPopupHandler();
    }
  };

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
          {/* Header */}
          <View className="items-center mb-4">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-3">
              <Feather name="check-circle" size={24} color="#10B981" />
            </View>
            <Text className="text-xl font-bold text-gray-800 text-center">
              Cancel Request
            </Text>
          </View>

          {/* Message */}
          <View className="items-center mb-6">
            <Text className="text-base text-gray-600 text-center leading-6">
              Your cancellation request has been submitted.
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6 mt-2">
              Please wait for confirmation from the seller.
            </Text>
          </View>

          {/* OK Button */}
          <TouchableOpacity
            onPress={hideSuccessPopup}
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER */}
      <View
        style={{ paddingTop: HEADER_TOP_PADDING }}
        className="flex-row items-center justify-start bg-white px-4 py-4 border-b border-gray-200"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-3">
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color="#1a1a1a"
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Cancel Order</Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50">
        {/* Product Card */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
          <View className="flex-row items-center">
            <Image
              source={{ uri: orderDetails.imageUrl }}
              className="w-16 h-16 rounded mr-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-base font-semibold text-black mb-1">
                {orderDetails.name}
              </Text>
              <Text className="text-xl font-bold text-red-600">
                ₱{orderDetails.price.toLocaleString("en-PH")}
              </Text>
            </View>
          </View>
        </View>

        {/* Cancellation Form */}
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
          <Text className="text-lg font-bold text-black mb-4">
            Select A Reason
          </Text>

          {/* Dropdown */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              className="border border-gray-300 rounded-lg p-4 flex-row justify-between items-center"
            >
              <Text className={`text-base ${selectedReason ? 'text-black' : 'text-gray-500'}`}>
                {selectedReason || "Select a reason for cancellation"}
              </Text>
              <Feather 
                name={showDropdown ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6b7280" 
              />
            </TouchableOpacity>

            {/* Dropdown Options */}
            {showDropdown && (
              <View className="border border-gray-300 border-t-0 rounded-b-lg bg-white mt-[-1] max-h-60">
                <ScrollView>
                  {cancellationReasons.map((reason, index) => (
                    <TouchableOpacity
                      key={reason}
                      onPress={() => {
                        setSelectedReason(reason);
                        setShowDropdown(false);
                      }}
                      className={`p-4 border-b border-gray-100 ${
                        index === cancellationReasons.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <Text className="text-base text-black">{reason}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Confirmation Checkbox */}
          <TouchableOpacity
            onPress={() => setIsConfirmed(!isConfirmed)}
            className="flex-row items-center mb-6"
          >
            <View className={`w-6 h-6 rounded-md border-2 mr-3 items-center justify-center ${
              isConfirmed ? 'bg-[#FF9500] border-[#FF9500]' : 'bg-white border-gray-400'
            }`}>
              {isConfirmed && (
                <Feather name="check" size={16} color="white" />
              )}
            </View>
            <Text className="text-base text-black font-medium">
              Confirm Cancellation
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmitCancellation}
            disabled={!selectedReason || !isConfirmed}
            className={`py-4 rounded-xl ${
              selectedReason && isConfirmed ? 'bg-red-500' : 'bg-gray-400'
            }`}
          >
            <Text className="text-white text-center font-bold text-base">
              Submit Cancellation Request
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>

      {/* Success Popup */}
      <SuccessPopup />
    </SafeAreaView>
  );
};

export default CancelOrder;