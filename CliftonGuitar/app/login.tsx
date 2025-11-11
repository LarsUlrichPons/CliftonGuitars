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
  Linking,
  Alert,
  Animated,
  useWindowDimensions,
} from "react-native";

const MOCK_ACCOUNT = {
  username: "kimchaewon",
  password: "@Chaechae123",
};

// ⭐️ START: Animation Logic
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
// ⭐️ END: Animation Logic

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ✅ Get screen dimensions for responsive design
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width >= 768;
  const isExtraLargeScreen = width >= 1024;

  const handleLogin = () => {
    setError(null);
    if (!username || !password) {
      setError("Please enter both username and password.");
      startShake();
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      if (
        username.trim() === MOCK_ACCOUNT.username &&
        password === MOCK_ACCOUNT.password
      ) {
        router.replace("/(tabs)/home");
      } else {
        setError("Invalid username or password.");
        setPassword("");
        startShake();
      }
      setSubmitting(false);
    }, 350);
  };

  const navigateToSignUp = () => router.replace("/signup");

  const handleForgotPassword = () => {
    const email = 'support@cliftonguitars.com';
    const subject = 'Password Reset Request for My Account';
    const body = `Hello, I need assistance resetting the password for my account with username: ${username || '[Enter your username]'}.`;
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(() => {
        Alert.alert("Email App Required", "Please configure an email application to send a reset request.");
    });
  };

  // ✅ Different background for web
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
        <View className="absolute inset-0 bg-black/30" 
       
      
        />

        
      )}
      
      <KeyboardAvoidingView
        behavior={isWeb ? "height" : "padding"}
        className="flex-1"
         keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'flex-start',
            paddingTop: height * 0.15 // ✅ Added this for vertical centering
          }}
          className={`flex-1 ${isWeb ? 'py-2' : 'py-4'} ${isLargeScreen ? 'py-12' : ''}`}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Container - Removed negative margin */}
          <View className={`
            w-full items-center
            
            ${isWeb ? 'max-w-[420px] self-center mt-20' : ''} {/* ✅ Changed -mt-10 to mt-4 */}
            ${isLargeScreen ? 'max-w-[480px]' : ''}
            ${isExtraLargeScreen ? 'max-w-[520px]' : ''}
          `}>
            
            {/* Logo Section - Adjusted padding */}
            <View className={`
              justify-center items-center px-8
              ${isWeb ? 'pt-4 pb-8' : 'pt-40 pb-14'} {/* ✅ Increased top padding */}
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

            {/* Form Section - Adjusted padding */}
            <View className={`
              w-full
              ${isWeb ? 'px-10 pb-8' : 'px-8 pb-8'} {/* ✅ Reduced bottom padding */}
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
              />

              {/* Password Input */}
              <View className={`
                w-full bg-white rounded-xl flex-row items-center mb-3 shadow-md
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
              
              {/* Forgot Password Link */}
              <View className="w-full items-end mb-4">
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text className="text-yellow-300 text-sm font-semibold underline" style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.7)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  }}>
                    Forgot Password?
                  </Text>
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

              {/* Login Button */}
              <Animated.View style={shake}>
                <TouchableOpacity
                  onPress={handleLogin}
                  className={`
                    w-full rounded-full items-center shadow-lg bg-yellow-400
                    ${submitting ? 'opacity-70' : ''}
                    ${isWeb ? 'p-4' : 'p-4'}
                    ${isLargeScreen ? 'p-5' : ''}
                  `}
                  disabled={submitting}
                >
                  <Text className={`
                    font-bold text-gray-900
                    ${isWeb ? 'text-lg' : 'text-lg'}
                    ${isLargeScreen ? 'text-xl' : ''}
                  `}>
                    {submitting ? "Signing in..." : "Log in"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Sign Up Link */}
              <View className="flex-row justify-center pt-6">
                <Text className="text-white/70 text-sm" style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.7)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}>
                  Do not have an account?{" "}
                </Text>
                <TouchableOpacity onPress={navigateToSignUp}>
                  <Text className="text-yellow-300 font-semibold text-sm" style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.7)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 3,
                  }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Policy Links - Moved closer */}
              <View className={`
                items-center mt-10 {/* ✅ Reduced from mt-10 */}
                ${isWeb ? 'mt-6' : ''} {/* ✅ Reduced from mt-8 */}
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

export default Login;