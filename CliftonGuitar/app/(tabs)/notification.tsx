import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Notification type definition
interface NotificationItem {
  id: number;
  type: "sale" | "update" | "system";
  title: string;
  message: string;
  time: string;
  isNew: boolean;
}

// Mock notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, type: "sale", title: "Flash Sale Alert!", message: "20% off all acoustic guitars ends tonight!", time: "1h ago", isNew: true },
  { id: 2, type: "update", title: "Order Shipped", message: "Your order #39482 is now out for delivery.", time: "5h ago", isNew: true },
  { id: 3, type: "system", title: "New Privacy Policy", message: "We updated our terms and conditions. Tap to review.", time: "1d ago", isNew: false },
  { id: 4, type: "sale", title: "New Product Drop", message: 'Check out the limited edition "Midnight Burst" Strat.', time: "2d ago", isNew: false },
  { id: 5, type: "update", title: "Inventory Update", message: "The vintage Gibson Les Paul is back in stock!", time: "3d ago", isNew: false },
];

// Helper for notification icon/dot
const getNotificationStyles = (type: NotificationItem["type"]) => {
  switch (type) {
    case "sale":
      return { dot: "bg-red-500", icon: "sale-outline" };
    case "update":
      return { dot: "bg-blue-500", icon: "truck-check-outline" };
    case "system":
      return { dot: "bg-gray-400", icon: "cog-outline" };
    default:
      return { dot: "bg-gray-400", icon: "bell-outline" };
  }
};

// --- Swipeable Notification Item ---
const SwipeableNotification = ({
  notification,
  onDelete,
}: {
  notification: NotificationItem;
  onDelete: () => void;
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [layoutWidth, setLayoutWidth] = useState(0);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2),
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dx < 0) translateX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          const swipeThreshold = -80;
          if (gestureState.dx < swipeThreshold) {
            Animated.timing(translateX, {
              toValue: -layoutWidth,
              duration: 200,
              useNativeDriver: true,
            }).start(onDelete);
          } else {
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        },
      }),
    [translateX, layoutWidth]
  );

  const { dot, icon } = getNotificationStyles(notification.type);

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      onLayout={handleLayout}
      className="bg-white border-b border-gray-100 overflow-hidden"
    >
      {/* Delete Background */}
      <View className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 items-center justify-center">
        <Text className="text-white font-bold">DELETE</Text>
      </View>

      {/* Notification Content */}
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
        className={`flex-row p-4 items-start ${notification.isNew ? "bg-blue-50" : "bg-white"}`}
      >
        {/* Status Dot & Icon */}
        <View className="flex-col items-center mr-3 pt-1">
          <View className={`w-2 h-2 rounded-full ${notification.isNew ? dot : "bg-transparent"} mb-2`} />
          <MaterialCommunityIcons name={icon as any} size={26} color={notification.isNew ? dot.replace("bg-", "#") : "#6b7280"} />
        </View>

        {/* Text Content */}
        <View className="flex-1">
          <Text className={`text-base text-[#1a1a1a] ${notification.isNew ? "font-extrabold" : "font-semibold"}`}>
            {notification.title}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">{notification.message}</Text>
          <Text className="text-xs text-gray-400 mt-2">{notification.time}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

// --- Main Notification Screen ---
const Notification = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleDelete = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));
  const handleBack = () => router.back();
  const handleReadAll = () => setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
  const unreadCount = notifications.filter(n => n.isNew).length;

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header matches Cart layout */}
      <SafeAreaView edges={["top"]} className="bg-white border-b border-gray-200 z-10">
        <View className="flex-row items-center justify-center py-5 px-4">
          <TouchableOpacity
            onPress={handleBack}
            className="absolute left-4 p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="chevron-left" size={30} color="#1a1a1a" />
          </TouchableOpacity>

          <Text className="text-xl font-semibold text-[#1a1a1a]">
            Notifications ({unreadCount})
          </Text>

          <TouchableOpacity
            onPress={handleReadAll}
            className="absolute right-4 p-2"
            disabled={unreadCount === 0}
          >
            <MaterialCommunityIcons
              name="check-all"
              size={22}
              color={unreadCount > 0 ? "#2563eb" : "#9ca3af"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Notifications List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          notifications.map(n => (
            <SwipeableNotification
              key={n.id}
              notification={n}
              onDelete={() => handleDelete(n.id)}
            />
          ))
        ) : (
          <View className="p-8 items-center justify-center bg-white m-4 rounded-xl shadow-md">
            <MaterialCommunityIcons name="bell-off-outline" size={50} color="#9ca3af" />
            <Text className="text-lg font-medium text-gray-500 mt-3">You’re all caught up!</Text>
            <Text className="text-sm text-gray-400 mt-1">No new notifications.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Notification;
