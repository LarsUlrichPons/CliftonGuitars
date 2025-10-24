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
  Animated,
  ImageBackground,
  ScrollView
} from "react-native";
// Removed unnecessary import: import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Shake animation for errors
const shakeAnimation = new Animated.Value(0);

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

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

  const handleSignup = () => {
    setError(null);

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields.");
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
    setTimeout(() => {
      router.replace("/login");
      setSubmitting(false);
    }, 1000);
  };

  return (
    // 1. ImageBackground now wraps the entire component to ensure it fills the screen
    <ImageBackground
      source={require('../assets/images/catalogs/Login_SignUp_bg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      {/* 2. KeyboardAvoidingView wraps the scrollable content */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* 3. ScrollView handles the content and scrolling when keyboard is up */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title - Removed flex: 1 so it doesn't push the form unnecessarily */}
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
            <Text style={[styles.textShadowWhite, { fontSize: 40, fontWeight: '800', color: 'white', marginBottom: 40 }]}>
              Clifton Guitars
            </Text>
          </View>

          {/* Form */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#888"
              value={username}
              onChangeText={(t) => { setUsername(t); if (error) setError(null); }}
              autoCapitalize="none"
              style={styles.input}
            />

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={(t) => { setPassword(t); if (error) setError(null); }}
                secureTextEntry={!showPassword}
                style={styles.inputField}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={(t) => { setConfirmPassword(t); if (error) setError(null); }}
                secureTextEntry={!showConfirmPassword}
                style={styles.inputField}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {error ? (
              <Text style={{ color: '#F87171', marginBottom: 8, fontSize: 13, paddingHorizontal: 4 }}>{error}</Text>
            ) : <View style={{ height: 8 }} />}

            <Animated.View style={shake}>
              <TouchableOpacity
                onPress={handleSignup}
                style={[styles.button, submitting && { opacity: 0.7 }]}
                disabled={submitting}
              >
                <Text style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: 16 }}>
                  {submitting ? "Registering..." : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
              <Text style={[styles.textShadowBlack, { color: 'white' }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={[styles.textShadowBlack, { color: '#FACC15', fontWeight: '600' }]}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Added missing text shadow styles for text visibility
  textShadowBlack: {
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  textShadowWhite: {
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputField: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  eyeButton: {
    padding: 12,
  },
  button: {
    backgroundColor: '#FACC15',
    padding: 16,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default Signup;
