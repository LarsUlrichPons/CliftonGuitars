import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- MOCK ORDER DETAILS (Replace with data fetching in production) ---
const MOCK_ORDER_DATA = {
    orderNumber: '#2001',
    address: 'Aldous Gusion (+63) 945 527 0831 299\nVarona st, Barangay 97, Tondo I / II, Metro Manila',
    paymentMethod: 'GCash',
    orderTotal: 14100.00,
    subtotal: 13800.00,
    shipping: 300.00,
    datePaid: '10/19/2025',
    estimatedArrival: 'October 25-27, 2025',
    // ✅ ADDED: Delivery received date for completed orders
    dateDelivered: 'October 26, 2025',
    product: {
        name: 'Clifton Hofner style Violin Bass',
        price: 13800,
        quantity: 1,
        imageUrl: 'https://placehold.co/100x100/F06292/FFFFFF?text=BASS',
    }
};

// --- STATUS CONFIGURATION ---
const STATUS_CONFIG: { [key: string]: { 
    bannerColor: string; 
    bannerText: string;
} } = {
    'To Pay': {
        bannerColor: 'bg-gray-500',
        bannerText: 'Order is Placed',
    },
    'To Ship': {
        bannerColor: 'bg-blue-600',
        bannerText: 'Preparing to Ship',
    },
    'To Receive': {
        bannerColor: 'bg-orange-500',
        bannerText: 'Parcel is out for delivery',
    },
    'Completed': {
        bannerColor: 'bg-green-600',
        bannerText: 'Delivered Successfully',
    },
    'Cancelled': {
        bannerColor: 'bg-red-500',
        bannerText: 'Order Cancelled',
    },
    'Return/Refunded': {
        bannerColor: 'bg-red-800',
        bannerText: 'Return/Refund Processed',
    }
};

const OrderDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // ✅ DYNAMIC STATUS: Read status from router params (passed from MyOrders)
  const status = (params.status as string) || 'To Pay';
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['To Pay'];
  
  // ✅ DYNAMIC DELIVERY TEXT: Show delivery date for completed orders, ETA for others
  const getDeliveryText = () => {
    if (status === 'Completed') {
      return {
        label: 'Date Delivered:',
        value: MOCK_ORDER_DATA.dateDelivered,
        showChevron: false // Hide chevron for completed orders since it's already delivered
      };
    } else {
      return {
        label: 'Estimated Time of Arrival:',
        value: MOCK_ORDER_DATA.estimatedArrival,
        showChevron: true
      };
    }
  };

  const deliveryInfo = getDeliveryText();
  
  const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 50) + 10 : 60;
  
  const handleBack = () => router.back();

  const handleDeliveryInfoPress = () => {
    // Only allow navigation if not completed (since delivery is already done)
    if (status !== 'Completed') {
      router.push('/DeliveryInformation');
    }
  };

  const handleRateProduct = () => {
    // Navigate to rate product screen
    router.push(`/RateProduct`);
  };

  const handleRequestRefundReturn = () => {
    // Navigate to refund/return request screen
    router.push(`/Return_Refunded`);
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-1 bg-[#D9D9D9]">
        
        {/* === HEADER === */}
        <View 
          style={{ paddingTop: HEADER_TOP_PADDING }} 
          className="flex-row items-center justify-start bg-white px-4 py-4 border-b border-gray-200" 
        >
          <TouchableOpacity
            onPress={handleBack}
            className="p-2 mr-3" 
          >
            <MaterialCommunityIcons name="chevron-left" size={30} color="#1a1a1a" /> 
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Order Details</Text>
        </View>
        
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          
          {/* === STATUS BANNER - Now dynamically changes based on order status === */}
          <View className="mx-5 mt-4">
            <View className={`w-full ${config.bannerColor} py-5 rounded-t-xl`}>
              <Text className="text-lg font-bold text-white text-center">{config.bannerText}</Text>
            </View>
          </View>
          
          {/* === Delivery Information === */}
          <View className="mx-5">
            <View className="bg-white p-5">
              <TouchableOpacity 
                className="flex-row justify-between items-start"
                onPress={handleDeliveryInfoPress}
                disabled={status === 'Completed'} // Disable touch when completed
              >
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-bold text-gray-900 mb-4">Delivery Information</Text>
                  <View className="space-y-2">
                    <Text className="text-base text-gray-700">
                      <Text className="font-semibold">Order Number:</Text> {MOCK_ORDER_DATA.orderNumber}
                    </Text>
                    <Text className="text-base text-gray-700 leading-6">
                      <Text className="font-semibold">Address:</Text> {MOCK_ORDER_DATA.address}
                    </Text>
                    <Text className="text-base text-gray-700">
                      <Text className="font-semibold">{deliveryInfo.label}</Text> {deliveryInfo.value}
                    </Text>
                  </View>
                </View>
                {/* Chevron Right Icon - Only show for non-completed orders */}
                {deliveryInfo.showChevron && (
                  <Feather name="chevron-right" size={24} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* === Payment Info === */}
          <View className="mx-5">
            <View className="bg-white p-5 border-t border-gray-200">
              <Text className="text-lg font-bold text-gray-900 mb-4">Payment Info</Text>
              <View className="space-y-2">
                <Text className="text-base text-gray-700">
                  <Text className="font-semibold">Method:</Text> {MOCK_ORDER_DATA.paymentMethod}
                </Text>
                <Text className="text-base text-gray-700">
                  <Text className="font-semibold">Date Paid:</Text> {MOCK_ORDER_DATA.datePaid}
                </Text>
              </View>
            </View>
          </View>

          {/* === Product Item Section === */}
          <View className="mx-5">
            <View className="bg-white p-5 border-t border-gray-200">
              {/* Product Row */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{ uri: MOCK_ORDER_DATA.product.imageUrl }}
                    className="w-20 h-20 rounded mr-4"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-black mb-2">
                      {MOCK_ORDER_DATA.product.name}
                    </Text>
                    <Text className="text-sm text-gray-500">x{MOCK_ORDER_DATA.product.quantity}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-base font-bold text-red-600">
                    ₱{MOCK_ORDER_DATA.product.price.toLocaleString('en-PH')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* === Order Totals === */}
          <View className="mx-5">
            <View className="bg-white p-5 border-t border-gray-200 rounded-b-xl">
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-base text-gray-600">Product Subtotal:</Text>
                  <Text className="text-base text-gray-800">₱{MOCK_ORDER_DATA.subtotal.toLocaleString('en-PH')}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-base text-gray-600">Shipping Subtotal:</Text>
                  <Text className="text-base text-gray-800">₱{MOCK_ORDER_DATA.shipping.toLocaleString('en-PH')}</Text>
                </View>
                <View className="flex-row justify-between pt-3 mt-2 border-t border-gray-300">
                  <Text className="text-lg font-bold text-black">Order Total:</Text>
                  <Text className="text-lg font-bold text-red-600">₱{MOCK_ORDER_DATA.orderTotal.toLocaleString('en-PH')}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* === Action Buttons for Completed Status === */}
          {status === 'Completed' && (
            <View className="mx-5 mt-4">
              <View className="bg-white p-5 rounded-xl">
                <Text className="text-lg font-bold text-gray-900 mb-4">Order Actions</Text>
                
                {/* Rate Product Button */}
                <TouchableOpacity 
                  onPress={handleRateProduct}
                  className="flex-row items-center justify-between py-4 border-b border-gray-200"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="star-outline" size={24} color="#FFD700" />
                    <Text className="text-base font-semibold text-black ml-3">Rate Product</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>

                {/* Request Refund/Return Button */}
                <TouchableOpacity 
                  onPress={handleRequestRefundReturn}
                  className="flex-row items-center justify-between py-4"
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="refresh" size={24} color="#EF4444" />
                    <Text className="text-base font-semibold text-black ml-3">Request Refund/Return</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Footer Spacing */}
          <View className="h-8" /> 
        </ScrollView>
        
      </View>
    </SafeAreaView>
  );
};

export default OrderDetails;