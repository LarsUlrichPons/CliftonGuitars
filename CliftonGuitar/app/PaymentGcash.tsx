import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

interface OrderDetails {
    orderNumber: string;
    totalAmount: string;
    paymentMethod: string;
    estimatedDelivery: string;
}

// --- START: OrderSuccessModal Component ---
const OrderSuccessModal = ({ visible, onClose, details }: { visible: boolean, onClose: () => void, details: OrderDetails }) => {
    
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onClose(); 
            }, 4000); 
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);

    if (!visible) return null;
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View className="flex-1 items-center justify-center bg-gray-600/60 p-6">
                <View className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                    <Text className="text-xl font-extrabold text-gray-800 text-center mb-6">
                        Order Placed Successfully
                    </Text>

                    <Text className="text-sm text-gray-700 mb-2">
                        Your order has been received and is now being processed.
                    </Text>
                    <Text className="text-sm text-gray-700 mb-6">
                        You will receive a confirmation email shortly with your order details.
                    </Text>

                    <View className="bg-gray-100 p-4 rounded-lg mb-4">
                        <View className="flex-row justify-between py-0.5">
                            <Text className="text-sm text-gray-600">Order Number:</Text>
                            <Text className="text-sm font-bold text-gray-800">{details.orderNumber}</Text>
                        </View>
                        <View className="flex-row justify-between py-0.5">
                            <Text className="text-sm text-gray-600">Total Amount:</Text>
                            <Text className="text-sm font-bold text-gray-800">₱{details.totalAmount}</Text>
                        </View>
                        <View className="flex-row justify-between py-0.5">
                            <Text className="text-sm text-gray-600">Payment Method:</Text>
                            <Text className="text-sm font-bold text-gray-800">{details.paymentMethod}</Text>
                        </View>
                        <View className="flex-row justify-between py-0.5 mt-1">
                            <Text className="text-sm text-gray-600">Estimated Delivery:</Text>
                            <Text className="text-sm font-bold text-gray-800">{details.estimatedDelivery}</Text>
                        </View>
                    </View>
                    
                    <Text className="text-xs text-center text-gray-500 mt-2">
                        Redirecting to home screen shortly...
                    </Text>
                </View>
            </View>
        </Modal>
    );
};
// --- END: OrderSuccessModal Component ---

const PaymentGcash = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [referenceNumber, setReferenceNumber] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  
  // DYNAMIC AMOUNT CALCULATION
  const totalAmount = Number(params.total || 0);
  
  const amountDueDisplay = totalAmount.toLocaleString('en-PH', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  
  const merchantGcashNumber = '0917 123 4567';

  const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 50) + 10 : 60;
  
  const isFormValid = referenceNumber.length > 5 && gcashNumber.length === 11 && totalAmount > 0 && paymentScreenshot;

  const orderDetails: OrderDetails = {
    orderNumber: '#2001', 
    totalAmount: totalAmount.toFixed(2), 
    paymentMethod: 'Gcash',
    estimatedDelivery: 'Oct 25–27, 2025', 
  };
  
  // ⭐️ FIXED: Updated ImagePicker configuration
  const handleUploadScreenshot = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload screenshots.');
        return;
      }

      // ⭐️ FIXED: Use the updated MediaType API
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: false,
        aspect: undefined,
        quality: 0.9,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setPaymentScreenshot(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading screenshot. Please try again.');
    }
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
  };
  
  const handleSubmitPayment = () => {
    Keyboard.dismiss();
    
    if (isFormValid) {
      setShowOrderSuccess(true);
    } else {
      if (!paymentScreenshot) {
        alert('Please upload a screenshot of your GCash payment for verification.');
      } else {
        alert('Please ensure all required fields are filled correctly and the amount is valid.');
      }
    }
  };
  
  const handleModalCloseAndNavigate = () => {
      setShowOrderSuccess(false);
      router.replace('/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-1 bg-gray-100">
        
        {/* === HEADER === */}
        <View 
          style={{ paddingTop: HEADER_TOP_PADDING }} 
          className="flex-row items-center justify-center bg-white px-4 py-4 border-b border-gray-200 shadow-md" 
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 p-2 pt-8" 
          >
            <MaterialCommunityIcons name="chevron-left" size={30} color="#1a1a1a" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Gcash Payment</Text>
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 80}
        >
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ 
              flexGrow: 1,
              paddingBottom: 120
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            
            {/* === Amount Due Card === */}
            <View className="bg-white p-4 my-3 mx-4 rounded-lg shadow-sm border border-gray-100">
              <Text className="text-sm font-semibold text-gray-600 mb-1">Total Amount Due</Text>
              <Text className="text-3xl font-extrabold text-red-600">₱ {amountDueDisplay}</Text>
            </View>

            {/* === QR Code and Instructions Section === */}
            <View className="bg-white p-4 mx-4 rounded-lg shadow-sm mb-4">
              <Text className="text-base font-bold text-black mb-3">1. Scan to Pay</Text>
              
              {/* QR Code Placeholder */}
              <View className="w-full items-center mb-4">
                  <Image
                      source={{ uri: `https://placehold.co/200x200/00B2EE/FFFFFF?text=GCASH+QR` }}
                      className="w-48 h-48 rounded-md border-2 border-green-500"
                  />
              </View>

              <Text className="text-sm text-center text-gray-700 mb-4">
                Send exactly <Text className="font-bold">₱{amountDueDisplay}</Text> to the Gcash number below:
              </Text>
              
              <View className="flex-row justify-center items-center p-3 bg-green-50 rounded-lg mb-4">
                  <Text className="text-lg font-bold text-green-700">{merchantGcashNumber}</Text>
              </View>

              <Text className="text-base font-bold text-black mb-3">2. Submit Transaction Details</Text>
              
              {/* Reference Number Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Gcash Reference Number <Text className="text-red-500">*</Text></Text>
                <TextInput
                  className="border border-gray-300 p-4 rounded-lg text-base bg-gray-50 h-14"
                  placeholder="Enter 12-digit reference number"
                  keyboardType="numeric" 
                  maxLength={12}
                  value={referenceNumber}
                  onChangeText={setReferenceNumber}
                  returnKeyType="next"
                />
              </View>

              {/* User Gcash Number Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Your Gcash Number <Text className="text-red-500">*</Text></Text>
                <TextInput
                  className="border border-gray-300 p-4 rounded-lg text-base bg-gray-50 h-14"
                  placeholder="09xx xxxx xxx"
                  keyboardType="numeric" 
                  maxLength={11}
                  value={gcashNumber}
                  onChangeText={setGcashNumber}
                  returnKeyType="next"
                />
              </View>

              {/* SCREENSHOT UPLOAD SECTION */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot <Text className="text-red-500">*</Text></Text>
                
                {paymentScreenshot ? (
                  <View className="relative">
                    <Image
                      source={{ uri: paymentScreenshot }}
                      className="w-full rounded-lg border-2 border-green-500"
                      resizeMode="contain"
                      style={{ height: 300 }}
                    />
                    <TouchableOpacity
                      onPress={handleRemoveScreenshot}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
                    >
                      <MaterialCommunityIcons name="close" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xs text-gray-500 mt-2 text-center">
                      Full screenshot uploaded successfully
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleUploadScreenshot}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center h-32 bg-gray-50"
                  >
                    <MaterialCommunityIcons name="camera-plus" size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 text-sm mt-2 text-center">
                      Tap to upload full screenshot{'\n'}of your GCash payment
                    </Text>
                    <Text className="text-xs text-gray-400 mt-1">
                      (No cropping - full image will be used)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-xs text-gray-500 mt-2">
                Note: Orders will be processed upon successful verification of the reference number and payment screenshot.
              </Text>
            </View>
            
            {/* Extra spacer for keyboard */}
            <View className="h-8" /> 
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* === Fixed Bottom Button === */}
        <View className="absolute inset-x-0 bottom-0 bg-white border-t border-gray-200 p-4">
          <TouchableOpacity
            onPress={handleSubmitPayment}
            disabled={!isFormValid}
            className={`p-4 rounded-lg items-center ${isFormValid ? 'bg-green-500' : 'bg-gray-400'}`}
          >
            <Text className="text-white text-lg font-bold">
              {isFormValid ? 'Confirm Gcash Payment' : 'Complete All Fields'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
      
      {/* Order Success Modal */}
      <OrderSuccessModal
          visible={showOrderSuccess}
          onClose={handleModalCloseAndNavigate}
          details={orderDetails}
      />
    </SafeAreaView>
  );
};

export default PaymentGcash;