import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const RateProduct = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Mock product data - in real app, this would come from params or API
  const product = {
    id: params.orderId || '1',
    name: params.productName || 'Clifton Hofner style Violin Bass',
    price: params.price || '13800',
    imageUrl: params.imageUrl || 'https://placehold.co/100x100/F06292/FFFFFF?text=BASS',
  };

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [errorFadeAnim] = useState(new Animated.Value(0));

  const handleSubmitReview = async () => {
    if (rating === 0) {
      showCustomAlert('Rating Required', 'Please select a star rating before submitting.');
      return;
    }

    if (review.trim().length < 10) {
      showCustomAlert('Review Too Short', 'Please write a review with at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      showSuccessPopupAnimation();
    }, 1500);
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
      // ⭐️ FIX: Navigate back to MyOrders with the ratedOrderId parameter
      router.push({
        pathname: '/MyOrders',
        params: { 
          ratedOrderId: product.id.toString(),
          activeTab: 'Completed' // Optional: Set the active tab to Completed
        }
      });
    });
  };

  const showCustomAlert = (title: string, message: string) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setShowErrorPopup(true);
    Animated.timing(errorFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideErrorPopup = () => {
    Animated.timing(errorFadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowErrorPopup(false);
    });
  };

  const RatingStar = ({ filled, onPress, size = 32 }: { filled: boolean; onPress?: () => void; size?: number }) => (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <MaterialCommunityIcons
        name={filled ? 'star' : 'star-outline'}
        size={size}
        color={filled ? '#FFD700' : '#CCCCCC'}
      />
    </TouchableOpacity>
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
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
              Review Submitted
            </Text>
          </View>

          <View className="items-center mb-6">
            <Text className="text-base text-gray-600 text-center leading-6">
              Your review has been submitted successfully.
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6 mt-2">
              Thank you for your feedback!
            </Text>
          </View>

          <TouchableOpacity
            onPress={hideSuccessPopup}
            className="bg-green-500 py-4 rounded-xl mt-2"
          >
            <Text className="text-white text-center font-bold text-base">
              OK
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );

  // Error Popup Component
  const ErrorPopup = () => (
    <Modal
      visible={showErrorPopup}
      transparent
      animationType="none"
      onRequestClose={hideErrorPopup}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animated.View 
          style={{ 
            opacity: errorFadeAnim,
            transform: [{
              scale: errorFadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            }]
          }}
          className="bg-white rounded-2xl p-6 mx-4 w-80 shadow-lg"
        >
          <View className="items-center mb-4">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
              <Feather name="alert-circle" size={32} color="#EF4444" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              {errorTitle}
            </Text>
          </View>

          <View className="items-center mb-6">
            <Text className="text-base text-gray-600 text-center leading-6">
              {errorMessage}
            </Text>
          </View>

          <TouchableOpacity
            onPress={hideErrorPopup}
            className="bg-red-500 py-4 rounded-xl mt-2"
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
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <MaterialCommunityIcons name="chevron-left" size={28} color="#1a1a1a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Rate Product</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="flex-1">
          {/* Scrollable Content with Keyboard Dismiss */}
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Product Card */}
              <View className="bg-white mx-4 mt-4 p-4 rounded-xl border border-gray-100">
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: product.imageUrl as string }}
                    className="w-16 h-16 rounded-lg mr-4"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-black">
                      {product.name as string}
                    </Text>
                    <Text className="text-xl font-bold text-red-600 mt-1">
                      ₱{parseInt(product.price as string).toLocaleString('en-PH')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Rating Section */}
              <View className="bg-white mx-4 mt-4 p-6 rounded-xl border border-gray-100">
                <Text className="text-2xl font-bold text-center text-black">
                  How would you rate this product?
                </Text>
                
                {/* Star Rating */}
                <View className="items-center my-6">
                  <View className="flex-row justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <RatingStar
                        key={star}
                        filled={star <= rating}
                        onPress={() => setRating(star)}
                        size={42}
                      />
                    ))}
                  </View>
                  <Text className="text-lg font-semibold text-gray-700">
                    {rating === 0 ? 'Tap to rate' : 
                     rating === 1 ? 'Poor' :
                     rating === 2 ? 'Fair' :
                     rating === 3 ? 'Good' :
                     rating === 4 ? 'Very Good' : 'Excellent'}
                  </Text>
                </View>

                {/* Review Input */}
                <View className="mt-4">
                  <Text className="text-lg font-semibold text-black mb-3">
                    Write your review
                  </Text>
                  <TextInput
                    value={review}
                    onChangeText={setReview}
                    placeholder="Share your experience with this product..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    className="border border-gray-300 rounded-xl p-4 text-base text-black bg-white min-h-[120px]"
                    maxLength={500}
                  />
                  <Text className="text-right text-sm text-gray-500 mt-2">
                    {review.length}/500 characters
                  </Text>
                </View>

                {/* Review Tips */}
                <View className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <Text className="text-sm font-semibold text-blue-800 mb-3">
                    Writing a good review:
                  </Text>
                  <View className="space-y-2">
                    <View className="flex-row items-start">
                      <Text className="text-blue-700 mr-2">•</Text>
                      <Text className="text-sm text-blue-700 flex-1">
                        Be specific about what you liked or did not like
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-blue-700 mr-2">•</Text>
                      <Text className="text-sm text-blue-700 flex-1">
                        Mention product quality, features, and value
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-blue-700 mr-2">•</Text>
                      <Text className="text-sm text-blue-700 flex-1">
                        Help other buyers make informed decisions
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-blue-700 mr-2">•</Text>
                      <Text className="text-sm text-blue-700 flex-1">
                        Keep it honest and respectful
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Extra space at the bottom for keyboard */}
              <View className="h-40" />
            </ScrollView>
          </TouchableWithoutFeedback>

          {/* Submit Button - Fixed outside the scrollable area */}
          <View className="bg-white border-t border-gray-200 p-4 pb-6">
            <TouchableOpacity
              onPress={handleSubmitReview}
              disabled={isSubmitting}
              className={`py-4 rounded-xl ${
                isSubmitting ? 'bg-gray-400' : 'bg-[#FF9500]'
              } shadow-lg`}
            >
              <Text className="text-white text-center font-bold text-lg">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Success Popup */}
      <SuccessPopup />

      {/* Error Popup */}
      <ErrorPopup />
    </SafeAreaView>
  );
};

export default RateProduct;