import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#2E2F2A",
          height: 80,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          elevation: 5,
        },
        tabBarIconStyle: {
          marginTop: 7, // pushes icons down a bit (centers them vertically)
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
           
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={28} // ⬅️ make this bigger
              />
           
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
           
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                color={color}
                size={28}
              />
           
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused }) => (
            
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                color={color}
                size={28}
              />

          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={28}
              />
           
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
