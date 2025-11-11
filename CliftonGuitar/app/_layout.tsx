import { Stack } from "expo-router";
import './globals.css';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function RootLayout() {
  return <AnimatedStack />;
}

function AnimatedStack() {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <Stack 
        initialRouteName="splashart"
        screenOptions={{
          // Default animation for all screens
          animation: 'fade',
          animationDuration: 300,
        }}
      >
        <Stack.Screen
          name="splashart"
          options={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 500, // Longer for splash
          }}
        />

        <Stack.Screen 
          name="(tabs)"
          options={{
            headerShown: false,
            animation: 'fade',
            animationDuration:5000
          }}
        />
        
        <Stack.Screen 
          name="products"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

        <Stack.Screen 
          name="login"
          options={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 5000
           
          }}
        />

         <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
            animation: 'fade',  
            animationDuration: 5000
          
          }}
        />

        <Stack.Screen 
          name="index"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />

       

        <Stack.Screen
          name="products_detail"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 350, // Custom timing for product details
          }}
        />

        <Stack.Screen
          name="Checkout"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />

        <Stack.Screen
          name="PaymentGcash"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />

        <Stack.Screen
          name="Address"
          options={{
            headerShown: false,
            animation: 'ios_from_right',
          }}
        />

        <Stack.Screen
          name="contactus"
          options={{
            headerShown: false,
            animation: 'ios_from_right',
          }}
        />
        
        <Stack.Screen
          name="EditProfile"
          options={{
            headerShown: false,
            animation: 'ios_from_right',
          }}
        />
        
        <Stack.Screen
          name="ChangePassword"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

        <Stack.Screen
          name="MyOrders"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
            animationDuration: 300
          }}
        />

        <Stack.Screen
          name="OrderDetails"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
        
        <Stack.Screen
          name="CancelOrder"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
      <Stack.Screen
          name="Return_Refunded"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

         <Stack.Screen
          name="RateProduct"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

          <Stack.Screen
          name="Wishlist"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

         <Stack.Screen
          name="DeliveryInformation"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

          <Stack.Screen
          name="CustomerSupport"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />

        {/* Add any modal-like screens with different animations */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            animation: 'fade',
            animationDuration: 400,
          }}
        />
      </Stack>
    </Animated.View>
  );
}