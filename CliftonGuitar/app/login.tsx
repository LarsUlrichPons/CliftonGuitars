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
  StyleSheet,
  ScrollView,
  ImageBackground, // Ensure ImageBackground is imported
} from "react-native";
// Removed Animated import as it wasn't used in this file

const MOCK_ACCOUNT = {
  username: "kimchaewon",
  password: "@Chaechae123",
};

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleLogin = () => {
    setError(null);
    if (!username || !password) {
      setError("Please enter both username and password.");
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
      }
      setSubmitting(false);
    }, 350);
  };

  const navigateToSignUp = () => router.replace("/signup");

  return (
    // 1. ImageBackground now wraps the entire component to ensure it fills the screen
    <ImageBackground
      source={require('../assets/images/catalogs/Login_SignUp_bg.png')}
      resizeMode="cover"
      style={{ flex: 1 }} // Must take up the full available space
      // Removed blurRadius={12} as it was blurring the entire background significantly, 
      // making text hard to read, which is generally bad practice for login screens.
    >
      {/* 2. KeyboardAvoidingView wraps the scrollable content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* 3. ScrollView handles the content and scrolling when keyboard is up */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View className="flex-1 justify-center items-center px-8 pt-12">
            <Text style={styles.textShadowWhite} className="text-5xl font-extrabold text-white text-center tracking-wider mb-16">
              Clifton Guitars
            </Text>
          </View>

          {/* Login Form */}
          <View className="w-full px-8 pb-16">
            <TextInput
              placeholder="Username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={(t) => {
                setUsername(t);
                if (error) setError(null);
              }}
              autoCapitalize="none"
              className="w-full bg-white p-4 rounded-xl text-[#1a1a1a] text-base mb-4 shadow-md"
            />

            <View className="w-full bg-white rounded-xl flex-row items-center mb-3 shadow-md">
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError(null);
                }}
                secureTextEntry={!showPassword}
                className="flex-1 p-4 text-[#1a1a1a] text-base"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="p-3"
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {error ? (
              <Text className="text-sm text-red-400 font-medium mb-3 px-1">{error}</Text>
            ) : (
              <View className="h-3" />
            )}

            <TouchableOpacity
              onPress={handleLogin}
              className={`w-full p-4 rounded-full items-center shadow-lg ${
                username && password ? "bg-yellow-400" : "bg-yellow-600/70"
              } ${submitting ? "opacity-70" : ""}`}
              disabled={!username || !password || submitting}
            >
              <Text className="text-lg font-bold text-[#1a1a1a]">
                {submitting ? "Signing in..." : "Log in"}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-6">
              <Text style={styles.textShadowBlack} className="text-white/70 text-sm">Don t have an account? </Text>
              <TouchableOpacity onPress={navigateToSignUp}>
                <Text style={styles.textShadowBlack} className="text-yellow-300 font-semibold text-sm">Sign up</Text>
              </TouchableOpacity>
            </View>
            
            {/* Policy Links - Added back the missing policy links that were in the previous Login file */}
            <View className="mt-16 items-center">
              <Text style={styles.textShadowBlack} className="text-white/70 text-xs text-center mb-1">
                By continuing, you agree to Clifton Guitars
              </Text>
              <View className="flex-row">
                <TouchableOpacity>
                  <Text style={styles.textShadowBlack} className="text-yellow-300 text-xs font-semibold underline mx-1">
                    Terms of Use
                  </Text>
                </TouchableOpacity>
                <Text style={styles.textShadowBlack} className="text-white/70 text-xs">and</Text>
                <TouchableOpacity>
                  <Text style={styles.textShadowBlack} className="text-yellow-300 text-xs font-semibold underline mx-1">
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  textShadowBlack: {
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  textShadowWhite: {
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  }
});

export default Login;
