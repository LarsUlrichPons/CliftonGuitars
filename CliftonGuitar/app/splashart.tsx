import { router } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { ImageBackground } from "react-native";

// Define the shake animation value outside the component (kept for consistency, though not used here)
const shakeAnimation = new Animated.Value(0);

const Splashart = () => {
  // Use useEffect to handle the navigation after a delay
  useEffect(() => {
    // Set a timeout to navigate to the login screen after 2.5 seconds (2500ms)
    const timer = setTimeout(() => {
      // Use replace to ensure the user cannot navigate back to the splash screen
      router.replace("/login");
    }, 2500);

    // Clean up the timeout if the component unmounts before navigation occurs
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Use the full-size, unblurred guitar image from the screenshot */}
      <ImageBackground
        // NOTE: Assuming you have an unblurred splash image in your assets folder
        source={require('../assets/images/catalogs/LoadingPage.jpg')}
        resizeMode="cover"
        blurRadius={10}
       
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />

        {/* Centered Content */}
        <View style={styles.contentContainer}>
          {/* Title */}
          <Text style={styles.title} className="text-6xl font-extrabold text-white text-center tracking-wider">
            Clifton{"\n"}Guitars
          </Text>
          
          {/* Tagline */}
          <Text style={styles.tagline} className="text-xl font-bold text-white text-center absolute bottom-12">
            NO FRILLS JUST TONE
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

// Stylesheet for styling the splash screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333', // Dark background color
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Add a subtle dark gradient/overlay if needed to ensure text pops
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    // Large, bold text shadow for maximum visibility
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  tagline: {
    // Text shadow for the tagline at the bottom
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  }
});

export default Splashart;
