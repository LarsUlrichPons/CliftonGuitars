import { View, Text, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const DeliveryInformation = () => {
  const router = useRouter()
  
  const deliveryData = [
    {
      id: 1,
      status: 'Parcel has been delivered',
      date: '25 oct 08:51',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 2,
      status: 'Parcel is out for delivery',
      date: '25 oct 08:51',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 3,
      status: 'Preparing to ship your parcel',
      date: '19 oct 18:10',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 4,
      status: 'Checking Payment',
      date: '19 oct 18:10',
      isCompleted: true,
      isCurrent: false
    },
    {
      id: 5,
      status: 'Order is placed',
      date: '19 oct 17:08',
      isCompleted: true,
      isCurrent: false
    }
  ]

  const handleBack = () => router.back()

  const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 50) + 10 : 60

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-1 bg-[#D9D9D9]">
        
        {/* === HEADER - Same as OrderDetails === */}
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
          <Text className="text-xl font-bold text-black">Delivery Tracking</Text>
        </View>
        
        {/* Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          
          {/* Combined Container with Order Information and Delivery Details */}
          <View className="mx-5 mt-4">
            <View className="bg-white rounded-xl overflow-hidden">
              
              {/* Order Information Section with Blue Left Border */}
              <View className="p-5 border-l-4 border-blue-500 bg-gray-50">
                <Text className="text-lg font-bold text-gray-900 mb-4">Order Information</Text>
                <View className="space-y-2">
                  <Text className="text-lg font-semibold text-gray-800">
                    Citron Horner style Violin Bass
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Order Number: #2001
                  </Text>
                </View>
              </View>

              {/* Divider Line */}
              <View className="border-t border-gray-200" />

              {/* Delivery Details Section */}
              <View className="p-5">
                <Text className="text-lg font-bold text-gray-900 mb-4">Delivery Details</Text>
                
                {deliveryData.map((item, index) => (
                  <View key={item.id} className="flex-row mb-2">
                    {/* Timeline dots and line */}
                    <View className="items-center mr-4 w-6">
                      <View className={`
                        w-5 h-5 rounded-full border-2 
                        ${index === 0 
                          ? 'border-blue-500 bg-white' 
                          : 'border-green-500 bg-green-500'
                        }
                        items-center justify-center
                      `}>
                        {index === 0 && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                      </View>
                      {index < deliveryData.length - 1 && (
                        <View className="w-0.5 flex-1 bg-gray-300 my-1" />
                      )}
                    </View>
                    
                    {/* Timeline content */}
                    <View className="flex-1 pb-6">
                      <Text className="text-base font-medium text-gray-800 mb-1">
                        {item.status}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {item.date}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

            </View>
          </View>

          {/* Footer Spacing */}
          <View className="h-8" />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default DeliveryInformation