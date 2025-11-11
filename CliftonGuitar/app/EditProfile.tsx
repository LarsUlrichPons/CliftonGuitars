import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
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
  Image,
  Alert, 
  Animated,
  KeyboardAvoidingView, // ⭐️ Added
  Keyboard, // ⭐️ Added
  TouchableWithoutFeedback, // ⭐️ Added
} from 'react-native';

import { SafeAreaView  } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker'; 

const MOCK_USER = {
    username: "kimchaewon",
    fullName: "Kim Chaewon",
    email: "kimchaewon01@gmail.com",
    phone: "(+63) 945 527 0831 299",
    avatarUrl: "https://i.pinimg.com/736x/50/a7/93/50a793644c1588c4cc74d47633f85dac.jpg",
};

interface ToastProps {
    visible: boolean;
}

const EditProfile = () => {
  const router = useRouter();
  
  const [profileImage, setProfileImage] = useState(MOCK_USER.avatarUrl); 
  const [username, setUsername] = useState(MOCK_USER.username);
  const [fullName, setFullName] = useState(MOCK_USER.fullName);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [password, setPassword] = useState('**********');
  
  const [showSuccess, setShowSuccess] = useState(false); 

  const isDataChanged = 
    username !== MOCK_USER.username || 
    fullName !== MOCK_USER.fullName ||
    email !== MOCK_USER.email ||
    phone !== MOCK_USER.phone ||
    password !== '**********' ||
    profileImage !== MOCK_USER.avatarUrl; 

  const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 50) + 10 : 60;
  
  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need camera roll permissions to select a photo.');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); 
    }
  };

  const handleSave = () => {
    Keyboard.dismiss(); // ⭐️ Dismiss keyboard when saving
    
    if (!isDataChanged) {
        router.back();
        return;
    }
    
    setShowSuccess(true);
    
    setTimeout(() => {
        setShowSuccess(false);
        router.back(); 
    }, 1500);
  };
  
  const handleBack = () => router.back();

  const handlePasswordChange = () => {
    router.push('/ChangePassword');
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
            <TouchableOpacity
              onPress={handleBack}
              className="p-2" 
            >
              <MaterialCommunityIcons name="chevron-left" size={24} color="#1a1a1a" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-black">My Profile</Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!isDataChanged}
              className={`p-2 ${isDataChanged ? 'opacity-100' : 'opacity-50'}`}
            >
              <Text className={`text-base font-semibold ${isDataChanged ? 'text-blue-600' : 'text-gray-400'}`}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            <ScrollView 
              className="flex-1"
              contentContainerStyle={{ 
                flexGrow: 1,
                paddingBottom: 20 
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              
              {/* === Profile Photo Section === */}
              <View className="items-center py-6 bg-white border-b border-gray-100 mb-4">
                <View className="relative">
                  <Image
                    source={{ uri: profileImage }}
                    className="w-28 h-28 rounded-full border-2 border-gray-200"
                  />
                  <TouchableOpacity 
                    onPress={handleCameraPress} 
                    className="absolute right-0 bottom-0 p-2 rounded-full bg-white border border-gray-300"
                  >
                    <Ionicons name="camera" size={16} color="#4A4A4A" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* === Editable Form Fields === */}
              <View className="bg-white p-6 mx-4 rounded-xl shadow-sm border border-gray-100">
                
                {/* Username */}
                <View className="mb-4 border-b border-gray-300">
                  <Text className="text-sm text-gray-500">Username:</Text>
                  <TextInput
                    className="text-base text-black pb-1 font-semibold h-10"
                    value={username}
                    onChangeText={setUsername}
                    returnKeyType="next"
                  />
                </View>

                {/* Full Name */}
                <View className="mb-4 border-b border-gray-300">
                  <Text className="text-sm text-gray-500">Full Name:</Text>
                  <TextInput
                    className="text-base text-black pb-1 font-semibold h-10"
                    value={fullName}
                    onChangeText={setFullName}
                    returnKeyType="next"
                  />
                </View>
                
                {/* Email */}
                <View className="mb-4 border-b border-gray-300">
                  <Text className="text-sm text-gray-500">Email:</Text>
                  <TextInput
                    className="text-base text-black pb-1 font-semibold h-10"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="next"
                  />
                </View>
                
                {/* Phone Number */}
                <View className="mb-4 border-b border-gray-300">
                  <Text className="text-sm text-gray-500">Phone#:</Text>
                  <TextInput
                    className="text-base text-black pb-1 font-semibold h-10"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    returnKeyType="done"
                  />
                </View>
                
                {/* Password */}
                <View className="mb-2 flex-row justify-between items-center border-b border-gray-300">
                  <View className="flex-1">
                    <Text className="text-sm text-gray-500">Password:</Text>
                    <TextInput
                      className="text-base text-black pb-1 font-semibold h-10"
                      secureTextEntry={true}
                      value={password}
                      onChangeText={setPassword}
                      returnKeyType="done"
                    />
                  </View>
                  <TouchableOpacity onPress={handlePasswordChange}>
                    <Text className="text-blue-500 font-semibold text-base">Change</Text>
                  </TouchableOpacity>
                </View>

              </View>
              
              <View className="h-20" /> 
            </ScrollView>
          </KeyboardAvoidingView>

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
                
                {/* Close Button (Icon only) */}
                <View className="absolute top-3 right-3">
                    <Ionicons name="close-circle" size={24} color="#dc2626" />
                </View>
                
                {/* Title */}
                <Text className="text-2xl font-bold text-black text-center mt-4 mb-2">
                    Profile Changed
                </Text>
                
                {/* Message */}
                <Text className="text-sm text-gray-600 text-center">
                    You have successfully edited your profile
                </Text>
            </View>
        </Animated.View>
    );
};
// --- END: Profile Success Toast Component ---

export default EditProfile;