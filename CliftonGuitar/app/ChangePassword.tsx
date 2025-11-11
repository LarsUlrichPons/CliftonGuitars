import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView  } from 'react-native-safe-area-context';

interface ToastProps {
    visible: boolean;
}

const ChangePassword = () => {
  const router = useRouter();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // ⭐️ ADDED: Show/Hide password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [showSuccess, setShowSuccess] = useState(false); 

  const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 50) + 10 : 60;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

  // ⭐️ FIXED: Simplified form validation for button enabling
  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleConfirm = () => {
    Keyboard.dismiss(); // ⭐️ Dismiss keyboard when confirming
    
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Weak Password',
        'Your new password must have:\n• At least 8 characters\n• One uppercase letter\n• One lowercase letter\n• One number\n• One symbol (e.g. @, #, !, $)'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }

    setShowSuccess(true);
    
    setTimeout(() => {
        setShowSuccess(false);
        router.back(); 
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View className="flex-1 bg-gray-50">
          {/* === HEADER === */}
          <View
            style={{ paddingTop: HEADER_TOP_PADDING }}
            className="flex-row items-center justify-between bg-white px-4 py-4 border-b border-gray-200 shadow-md"
          >
            <TouchableOpacity onPress={handleCancel} className="p-2">
              <MaterialCommunityIcons name="chevron-left" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-black">Change Password</Text>
            <View className="w-10" />
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
              {/* === Password Form === */}
              <View className="bg-white p-6 mx-4 rounded-xl shadow-sm border border-gray-100 mt-4">
                <Text className="text-xl font-bold text-gray-800 mb-6">Password</Text>

                {/* Current Password with Show/Hide */}
                <View className="mb-6">
                  <Text className="text-base text-gray-700 mb-2">Current Password:</Text>
                  <View className="flex-row items-center border-b border-gray-300">
                    <TextInput
                      className="flex-1 text-lg text-black h-12"
                      secureTextEntry={!showCurrentPassword}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      returnKeyType="next"
                      placeholder="Enter current password"
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                      onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="p-3"
                    >
                      <MaterialCommunityIcons
                        name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                        size={24}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* New Password with Show/Hide */}
                <View className="mb-6">
                  <Text className="text-base text-gray-700 mb-2">New Password:</Text>
                  <View className="flex-row items-center border-b border-gray-300">
                    <TextInput
                      className="flex-1 text-lg text-black h-12"
                      secureTextEntry={!showNewPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      returnKeyType="next"
                      placeholder="Enter new password"
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPassword(!showNewPassword)}
                      className="p-3"
                    >
                      <MaterialCommunityIcons
                        name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                        size={24}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm New Password with Show/Hide */}
                <View className="mb-6">
                  <Text className="text-base text-gray-700 mb-2">Confirm Password:</Text>
                  <View className="flex-row items-center border-b border-gray-300">
                    <TextInput
                      className="flex-1 text-lg text-black h-12"
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      returnKeyType="done"
                      onSubmitEditing={handleConfirm}
                      placeholder="Confirm new password"
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-3"
                    >
                      <MaterialCommunityIcons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={24}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* ⭐️ ADDED: Password Requirements Hint */}
                <View className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <Text className="text-sm text-yellow-800 font-semibold mb-1">
                    Password Requirements:
                  </Text>
                  <Text className="text-xs text-yellow-700">
                    • At least 8 characters{"\n"}
                    • One uppercase letter{"\n"}
                    • One lowercase letter{"\n"}
                    • One number{"\n"}
                    • One symbol (@ $ ! % * ? & # ^)
                  </Text>
                </View>
              </View>

              <View className="h-8" />
            </ScrollView>
          </KeyboardAvoidingView>

          {/* === Bottom Buttons === */}
          <View className="absolute inset-x-0 bottom-0 bg-white p-4 border-t border-gray-200 flex-row justify-center">
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!isFormValid}
              className={`w-1/2 p-4 rounded-xl items-center ${
                isFormValid ? 'bg-black' : 'bg-gray-400'
              }`}
            >
              <Text className="text-white text-lg font-bold">Confirm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCancel}
              className="w-1/2 p-4 rounded-xl items-center bg-gray-100 border border-gray-300 ml-2"
            >
              <Text className="text-black text-lg font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* ⭐️ Render the success toast ⭐️ */}
        <ProfileSuccessToast visible={showSuccess} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

// --- START: Profile Success Toast Component ---
const ProfileSuccessToast: React.FC<ToastProps> = ({ visible }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [visible, opacity]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[{ opacity }]}
            className="absolute inset-0 items-center justify-center px-6 z-50 bg-black/30" 
            pointerEvents="none" 
        >
            <View className="items-center justify-center bg-white rounded-xl p-8 shadow-2xl elevation-5 w-full max-w-xs">
                
                {/* Success Icon instead of Close */}
                <View className="mb-3">
                  <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                </View>
                
                {/* Title */}
                <Text className="text-2xl font-bold text-black text-center mb-2">
                    Password Changed
                </Text>
                
                {/* Message */}
                <Text className="text-sm text-gray-600 text-center">
                    You have successfully changed your password
                </Text>
            </View>
        </Animated.View>
    );
};
// --- END: Profile Success Toast Component ---

export default ChangePassword;