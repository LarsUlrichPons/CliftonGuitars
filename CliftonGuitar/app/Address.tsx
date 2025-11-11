import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Address = () => {
  const router = useRouter();
  
  // State for input fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine, setAddressLine] = useState('');

  // Dynamic top padding for consistent header height
  const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 50) + 10 : 60;
  
  // Form validation
  const isFormValid = fullName.trim() !== '' && phoneNumber.length > 9 && addressLine.trim() !== '';

  const handleConfirmAddress = () => {
    if (isFormValid) {
      alert(`Address Confirmed for ${fullName}. Navigating back.`);
      router.back();
    } else {
      alert('Please fill in all required address details.');
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-1 bg-gray-200">
        
        {/* === HEADER === */}
        <View 
          style={{ paddingTop: HEADER_TOP_PADDING }} 
          className="flex-row items-center justify-start bg-white px-4 py-4 border-b border-gray-200 shadow-md"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 mr-3"
          >
            {/* ✅ Changed to chevron-left */}
            <MaterialCommunityIcons name="chevron-left" size={30} color="#1a1a1a" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">New Address</Text>
        </View>
        
        <ScrollView className="flex-1 pt-4">
          
          {/* === ADDRESS FORM === */}
          <View className="bg-white mx-4 p-4 rounded-xl shadow-md border border-gray-100">
            <Text className="text-xl font-bold text-gray-800 mb-4">Address</Text>
            
            {/* Full Name Input */}
            <View className="mb-4 border-b border-gray-300 pb-2">
              <TextInput
                className="text-base text-black"
                placeholder="Full Name"
                placeholderTextColor="#A0A0A0"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Phone Number Input */}
            <View className="mb-4 border-b border-gray-300 pb-2">
              <TextInput
                className="text-base text-black"
                placeholder="Phone Number"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
                maxLength={11}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* Address Details Input */}
            <View className="mb-4 border-b border-gray-300 pb-2">
              <TextInput
                className="text-base text-black"
                placeholder="House No, Street Name, Barangay, City"
                placeholderTextColor="#A0A0A0"
                multiline={true}
                value={addressLine}
                onChangeText={setAddressLine}
              />
            </View>
          </View>
          
          <View className="h-20" />
        </ScrollView>
        
        {/* === CONFIRM BUTTON === */}
        <View className="absolute inset-x-0 bottom-0 bg-white p-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleConfirmAddress}
            disabled={!isFormValid}
            className={`p-4 rounded-xl items-center ${isFormValid ? 'bg-black' : 'bg-gray-400'}`}
          >
            <Text className="text-white text-lg font-bold">Confirm Address</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default Address;
