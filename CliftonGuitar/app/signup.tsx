import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Animated,
  useWindowDimensions,
} from "react-native";

// Shake animation for errors
const shakeAnimation = new Animated.Value(0);

const startShake = () => {
  shakeAnimation.setValue(0);
  Animated.timing(shakeAnimation, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start(() => shakeAnimation.setValue(0));
};

const shake = {
  transform: [
    {
      translateX: shakeAnimation.interpolate({
        inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
        outputRange: [0, -10, 10, -10, 10, 0],
      }),
    },
  ],
};

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ✅ Get screen dimensions for responsive design
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width >= 768;
  const isExtraLargeScreen = width >= 1024;

  const emailRegex = /\S+@\S+\.\S+/;

  const handleSignup = () => {
    setError(null);

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      startShake();
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      startShake();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      startShake();
      return;
    }

    if (
      password.length < 8 ||
      !/[0-9]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[^a-zA-Z0-9]/.test(password)
    ) {
      setError(
        "Password must be at least 8 characters, with a number, capital letter, and symbol."
      );
      startShake();
      return;
    }

    setSubmitting(true);

    // Mock success (you can connect this to your backend later)
    setTimeout(() => {
      router.replace("/login");
      setSubmitting(false);
    }, 1000);
  };

   const backgroundSource = isWeb 
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ? require('../assets/images/catalogs/LoadingPage.jpg')
    : require('../assets/images/catalogs/Login_SignUp_bg.png');


  return (
    <ImageBackground
      source={backgroundSource}
      resizeMode="cover"
      className="flex-1"
      blurRadius={5}
    >
      {/* ✅ Web-specific background overlay */}
      {isWeb && (
        <View className="absolute inset-0 bg-black/30" />
      )}
      
      <KeyboardAvoidingView
        behavior={isWeb ? "height" : "padding"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center'
          }}
          className={`flex-1 ${isWeb ? 'py-2' : 'py-4'} ${isLargeScreen ? 'py-12' : ''}`}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Container */}
          <View className={`
            w-full items-center
            ${isWeb ? 'max-w-[420px] self-center mt-8' : ''}
            ${isLargeScreen ? 'max-w-[480px]' : ''}
            ${isExtraLargeScreen ? 'max-w-[520px]' : ''}
          `}>
            
            {/* Logo Section */}
            <View className={`
              justify-center items-center px-8
              ${isWeb ? 'pt-4 pb-8' : 'pt-40 pb-14'}
              ${isLargeScreen ? 'pb-10' : ''}
            `}>
              <Text className={`
                font-extrabold text-white text-center tracking-wider
                ${isWeb ? 'text-5xl' : 'text-4xl'}
                ${isLargeScreen ? 'text-6xl' : ''}
              `} style={{
                textShadowColor: 'rgba(0, 0, 0, 0.9)',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 8,
              }}>
                Cliftunes
              </Text>
            </View>

            {/* Signup Form */}
            <View className={`
              w-full
              ${isWeb ? 'px-10 pb-8' : 'px-8 pb-8'}
              ${isLargeScreen ? 'px-12' : ''}
            `}>
              {/* Username Input */}
              <TextInput
                placeholder="Username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={(t) => {
                  setUsername(t);
                  if (error) setError(null);
                }}
                autoCapitalize="none"
                className={`
                  w-full bg-white rounded-xl text-gray-800 mb-4 shadow-md
                  ${isWeb ? 'p-4 text-lg bg-white/95' : 'p-4 text-base'}
                  ${isLargeScreen ? 'p-5 text-xl rounded-2xl' : ''}
                `}
                returnKeyType="next"
              />

              {/* Email Input */}
              <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (error) setError(null);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                className={`
                  w-full bg-white rounded-xl text-gray-800 mb-4 shadow-md
                  ${isWeb ? 'p-4 text-lg bg-white/95' : 'p-4 text-base'}
                  ${isLargeScreen ? 'p-5 text-xl rounded-2xl' : ''}
                `}
                returnKeyType="next"
              />

              {/* Password Input */}
              <View className={`
                w-full bg-white rounded-xl flex-row items-center mb-4 shadow-md
                ${isWeb ? 'bg-white/95' : ''}
                ${isLargeScreen ? 'rounded-2xl' : ''}
              `}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (error) setError(null);
                  }}
                  secureTextEntry={!showPassword}
                  className={`
                    flex-1 text-gray-800
                    ${isWeb ? 'p-4 text-lg' : 'p-4 text-base'}
                    ${isLargeScreen ? 'p-5 text-xl' : ''}
                  `}
                  returnKeyType="next"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="p-3"
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={isLargeScreen ? 28 : 24}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View className={`
                w-full bg-white rounded-xl flex-row items-center mb-4 shadow-md
                ${isWeb ? 'bg-white/95' : ''}
                ${isLargeScreen ? 'rounded-2xl' : ''}
              `}>
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#888"
                  value={confirmPassword}
                  onChangeText={(t) => {
                    setConfirmPassword(t);
                    if (error) setError(null);
                  }}
                  secureTextEntry={!showConfirmPassword}
                  className={`
                    flex-1 text-gray-800
                    ${isWeb ? 'p-4 text-lg' : 'p-4 text-base'}
                    ${isLargeScreen ? 'p-5 text-xl' : ''}
                  `}
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-3"
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={isLargeScreen ? 28 : 24}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              {/* Error Message */}
              {error ? (
                <Text className="text-red-400 text-sm font-medium mb-3 px-1">
                  {error}
                </Text>
              ) : (
                <View className="h-3" />
              )}

              {/* Sign Up Button with Shake Animation */}
              <Animated.View style={shake}>
                <TouchableOpacity
                  onPress={handleSignup}
                  disabled={submitting}
                  className={`
                    w-full rounded-full items-center shadow-lg bg-yellow-400
                    ${submitting ? 'opacity-70' : ''}
                    ${isWeb ? 'p-4' : 'p-4'}
                    ${isLargeScreen ? 'p-5' : ''}
                  `}
                >
                  <Text className={`
                    font-bold text-gray-900
                    ${isWeb ? 'text-lg' : 'text-lg'}
                    ${isLargeScreen ? 'text-xl' : ''}
                  `}>
                    {submitting ? "Registering..." : "Sign Up"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Login Link */}
              <View className="flex-row justify-center pt-6">
                <Text className="text-white/70 text-sm" style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.7)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.replace("/login")}>
                  <Text className="text-yellow-300 font-semibold text-sm" style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.7)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  }}>
                    Log in
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Policy Links */}
              <View className={`
                items-center mt-10
                ${isWeb ? 'mt-6' : ''}
              `}>
                <Text className="text-white/70 text-xs text-center mb-1" style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.7)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}>
                  By continuing, you agree to Clifton Guitars
                </Text>
                <View className="flex-row items-center">
                  <TouchableOpacity>
                    <Text className="text-yellow-300 text-xs font-semibold underline mx-1" style={{
                      textShadowColor: 'rgba(0, 0, 0, 0.7)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}>
                      Terms of Use
                    </Text>
                  </TouchableOpacity>
                  <Text className="text-white/70 text-xs" style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.7)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  }}>and</Text>
                  <TouchableOpacity>
                    <Text className="text-yellow-300 text-xs font-semibold underline mx-1" style={{
                      textShadowColor: 'rgba(0, 0, 0, 0.7)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}>
                      Privacy Policy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Signup;